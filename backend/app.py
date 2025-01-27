from flask import Flask, request, jsonify
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
import joblib
import asyncio
import os
from threading import Lock
import logging
from typing import List, Dict, Union
from prometheus_client import Histogram, Counter, Gauge
from datetime import datetime
from models import db, Student, StudentProfile
from flask_cors import CORS
from config import Config
from flask_migrate import Migrate



from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash


# Monitoring setup
RECOMMENDATION_LATENCY = Histogram('recommendation_latency_seconds', 'Time spent processing recommendations')
ENGAGEMENT_SCORE_GAUGE = Gauge('engagement_score_average', 'Average engagement score across all students')
MODEL_TRAINING_DURATION = Histogram('model_training_duration_seconds', 'Time spent training models')
INTERACTION_COUNTER = Counter('interaction_total', 'Total number of logged interactions')
base_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(base_dir, 'data')

# Ensure the data directory exists
os.makedirs(data_dir, exist_ok=True)

# Check if required files exist
students_path = os.path.join(data_dir, 'students.csv')
courses_path = os.path.join(data_dir, 'courses.csv')
engagement_path = os.path.join(data_dir, 'engagement.csv')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    db.init_app(app)
    jwt = JWTManager(app)
    
    with app.app_context():
        db.create_all()
    Migrate(app, db)
    return app
app = create_app()

class RecommendationEngine:
    def __init__(self):
        self.data_lock = Lock()
        self.available_courses_index = set()
        self.cached_engagement_scores = {}
        self.load_datasets()
        self.cf_model = None
        self.cbf_model = None
        self.tfidf_vectorizer = None
        self.load_or_train_models()
    
    def _create_sparse_matrix(self) -> csr_matrix:
        """
        Creates a sparse matrix for the user-item (student-course) engagement data.
        """
        try:
            # Ensure the engagement data has the required columns
            if not all(col in self.engagement.columns for col in ['student_id', 'course_id', 'rating']):
                raise ValueError("Engagement data is missing required columns: 'student_id', 'course_id', 'rating'")

            # Create a pivot table for the user-item matrix
            user_item_df = self.engagement.pivot_table(
                index='student_id', 
                columns='course_id', 
                values='rating', 
                fill_value=0
            )
            
            # Convert the pivot table to a sparse matrix
            sparse_matrix = csr_matrix(user_item_df.values)
            return sparse_matrix
        except Exception as e:
            logger.error(f"Error creating sparse matrix: {e}")
            raise
    def update_available_courses(self) -> None:
        """
        Updates the set of available courses based on the courses dataset.
        """
        try:
            if 'course_id' in self.courses.columns:
                self.available_courses_index = set(self.courses['course_id'])
            else:
                raise ValueError("Courses dataset is missing the required 'course_id' column")
            logger.info("Available courses updated successfully")
        except Exception as e:
            logger.error(f"Error updating available courses: {e}")
            raise


    def load_datasets(self) -> None:
        try:
            self.students = pd.read_csv(students_path)
            self.courses = pd.read_csv(courses_path )
            self.engagement = pd.read_csv(engagement_path)
            self.user_item_matrix = self._create_sparse_matrix()
            self.update_available_courses()
            logger.info("Datasets loaded successfully")
        except Exception as e:
            logger.error(f"Error loading datasets: {e}")
            raise

    def load_or_train_models(self) -> None:
        os.makedirs('models', exist_ok=True)  # Ensure models/ directory exists
        with MODEL_TRAINING_DURATION.time():
            try:
                if self._check_saved_models():
                    self._load_saved_models()
                else:
                    self._train_new_models()
            except Exception as e:
                logger.error(f"Error in model initialization: {e}")
                raise

    def _train_new_models(self) -> None:
        logger.info("Training new models...")
        self.train_cf_model()
        self.train_cbf_model()
        self._save_models()

    def train_cf_model(self) -> None:
        reader = Reader(rating_scale=(1, 5))
        data = Dataset.load_from_df(
            self.engagement[['student_id', 'course_id', 'rating']], 
            reader
        )
        trainset, _ = train_test_split(data, test_size=0.2)
        self.cf_model = SVD(n_factors=100)
        self.cf_model.fit(trainset)
        logger.info("CF model trained successfully")

    def train_cbf_model(self) -> None:
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        course_features = self.tfidf_vectorizer.fit_transform(self.courses['features'])
        self.cbf_model = cosine_similarity(course_features)
        logger.info("CBF model trained successfully")

    def _save_models(self) -> None:
        joblib.dump(self.cf_model, 'models/cf_model.pk')
        joblib.dump(self.tfidf_vectorizer, 'models/tfidf_vectorizer.pk')
        joblib.dump(self.cbf_model, 'models/cbf_similarity_matrix.pk')
        logger.info("Models saved successfully")

    def _load_saved_models(self) -> None:
        self.cf_model = joblib.load('models/cf_model.pk')
        self.tfidf_vectorizer = joblib.load('models/tfidf_vectorizer.pk')
        self.cbf_model = joblib.load('models/cbf_similarity_matrix.pk')
        logger.info("Models loaded successfully")

    def _check_saved_models(self) -> bool:
        return os.path.exists('models/cf_model.pk') and os.path.exists('models/tfidf_vectorizer.pk') and os.path.exists('models/cbf_similarity_matrix.pk')

    async def get_hybrid_recommendations(
        self, 
        student_id: int, 
        n: int = 5
    ) -> Dict[str, Union[List, float]]:
        with RECOMMENDATION_LATENCY.time():
            normalized_engagement = self.normalize_engagement_score(student_id)
            
            cf_task = asyncio.to_thread(self.get_cf_recommendations, student_id, n)
            cbf_task = asyncio.to_thread(self.get_cbf_recommendations, student_id, n)
            
            cf_recs, cbf_recs = await asyncio.gather(cf_task, cbf_task)
            
            hybrid_recs = self._combine_recommendations(
                cf_recs, 
                cbf_recs, 
                normalized_engagement
            )
            
            return {
                'recommendations': sorted(hybrid_recs, key=lambda x: x['confidence'], reverse=True)[:n],
                'engagement_score': normalized_engagement
            }

    async def log_interaction(self, interaction_data: Dict) -> None:
        INTERACTION_COUNTER.inc()
        with self.data_lock:
            if self._validate_interaction(interaction_data):
                self.engagement = pd.concat([
                    self.engagement, 
                    pd.DataFrame([interaction_data])
                ], ignore_index=True)
                self.engagement.to_csv('data/engagement.csv', index=False)
                self.user_item_matrix = self._create_sparse_matrix()
                self.cached_engagement_scores.pop(interaction_data['student_id'], None)
                await self.update_engagement_metrics()

    def calculate_engagement_metrics(self) -> Dict:
        try:
            overall_time = self.engagement.groupby(['course_id'])['time_spent'].mean()
            avg_time_spent = self.engagement['time_spent'].mean()

            # Calculate engagement score
            self.engagement['engagement_score'] = (
                0.4 * (self.engagement['time_spent'] / avg_time_spent) +
                0.4 * (self.engagement['quiz_score'] / 100) +
                0.2 * (self.engagement['rating'] / 5)
            )

            # Calculate content performance metrics
            content_performance = pd.merge(
                self.engagement,
                self.courses[['course_id', 'content_type']],
                on='course_id'
            ).groupby('content_type').agg({
                'quiz_score': 'mean',
                'engagement_score': 'mean',
                'time_spent': 'mean'
            })

            return {
                'overall_time': overall_time.to_dict(),
                'content_performance': content_performance.to_dict(),
                'avg_engagement_score': self.engagement['engagement_score'].mean()
            }
        except Exception as e:
            logger.error(f"Error calculating engagement metrics: {e}")
            return {}

    def calculate_engagement_score(self, student_id: int) -> float:
        try:
            student_engagement = self.engagement[self.engagement['student_id'] == student_id]
            if student_engagement.empty:
                logger.info(f"No engagement data found for student {student_id}")
                return 0.0

            time_score = student_engagement['time_spent'].sum() / self.courses['expected_time'].sum()
            completion_score = student_engagement['completion_status'].mean()
            quiz_score = student_engagement['quiz_score'].mean()

            score = (0.4 * time_score + 0.3 * completion_score + 0.3 * quiz_score)
            logger.info(f"Calculated engagement score for student {student_id}: {score:.2f}")
            return score
        except Exception as e:
            logger.error(f"Error calculating engagement score for student {student_id}: {e}")
            return 0.0

    def normalize_engagement_score(self, student_id: int) -> float:
        try:
            # Calculate engagement scores for all students
            scores = self.engagement.groupby('student_id').apply(
                lambda df: self.calculate_engagement_score(df['student_id'].iloc[0])
            )

            # Normalize scores using MinMaxScaler
            scaler = MinMaxScaler()
            normalized_scores = scaler.fit_transform(scores.values.reshape(-1, 1))
            normalized_score = dict(zip(scores.index, normalized_scores))[student_id]

            return normalized_score
        except Exception as e:
            logger.error(f"Error normalizing engagement score for student {student_id}: {e}")
            return 0.0


    def get_student_progress(self, student_id: int) -> Dict:
        student_data = self.engagement[self.engagement['student_id'] == student_id]
        progress_metrics = {
            'engagement_score': student_data['engagement_score'].mean(),
            'quiz_performance': student_data['quiz_score'].mean(),
            'preferred_content': self._get_preferred_content_type(student_id),
            'completed_courses': len(student_data[student_data['completion_status'] == 1.0])
        }
        progress_metrics['ready_for_next'] = (
            progress_metrics['engagement_score'] > 0.7 and 
            progress_metrics['quiz_performance'] > 70
        )
        return progress_metrics

    def _get_preferred_content_type(self, student_id: int) -> str:
        student_performance = pd.merge(
            self.engagement[self.engagement['student_id'] == student_id],
            self.courses[['course_id', 'content_type']],
            on='course_id'
        )
        return student_performance.groupby('content_type')['quiz_score'].mean().idxmax()

    def update_engagement_metrics(self) -> None:
        metrics = self.calculate_engagement_metrics()
        ENGAGEMENT_SCORE_GAUGE.set(metrics['avg_engagement_score'])
    def initialize_student_engagement(self,student_id):
        try:
            new_engagement = {'student_id': student_id, 'course_id': None, 'rating': 0}
            self.engagement = self.engagement.append(new_engagement, ignore_index=True)
            self.engagement.to_csv(engagement_path, index=False)
            logger.info(f"Engagement initialized for student_id {student_id}")
        except Exception as e:
            logger.error(f"Error initializing engagement: {e}")

@app.route('/train', methods=['POST'])
async def train_models():
    try:
        await engine.load_or_train_models()
        return jsonify({"message": "Models trained successfully"})
    except Exception as e:
        logger.error(f"Training error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/recommendations/<int:student_id>', methods=['GET'])
async def get_recommendations(student_id: int):
    try:
        if student_id not in engine.students['student_id'].values:
            return jsonify({'error': 'Invalid student ID'}), 400
            
        result = await engine.get_hybrid_recommendations(student_id)
        return jsonify({
            'student_id': student_id,
            'engagement_score': result['engagement_score'],
            'recommendations': result['recommendations'],
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Recommendation error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/metrics/engagement/<int:student_id>', methods=['GET'])
async def get_engagement_metrics(student_id: int):
    try:
        progress = engine.get_student_progress(student_id)
        return jsonify({
            'student_id': student_id,
            'progress_metrics': progress,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error fetching engagement metrics: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/metrics/content-performance', methods=['GET'])
async def get_content_performance():
    try:
        metrics = engine.calculate_engagement_metrics()
        return jsonify({
            'content_performance': metrics['content_performance'],
            'overall_time': metrics['overall_time'],
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error fetching content performance: {e}")
        return jsonify({'error': 'Internal server error'}), 500
def hash_password(password: str) -> str:
    return generate_password_hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return check_password_hash(password, hashed)
    

@app.route('/register', methods=['POST'])
def register_student():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['full_name', 'email', 'password', 'interests', 'skillLevel']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
            
        # Check for duplicate email
        if Student.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400

        # Create new student
        new_student = Student(
            full_name=data['full_name'],
            email=data['email'],
            password=hash_password(data['password']),
            interests=data['interests'],
            skill_level=data['skillLevel'],
            preferred_categories=data.get('preferredCategories', [])
        )
        
        # Create student profile
        profile = StudentProfile(student=new_student)
        
        # Add to database
        db.session.add(new_student)
        db.session.add(profile)
        db.session.commit()
        
        # Generate JWT token
        access_token = create_access_token(
            identity={'student_id': new_student.id, 'email': new_student.email}
        )
        
        return jsonify({
            'student_id': new_student.id,
            'token': access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error in registration: {e}")
        return jsonify({'error': 'An error occurred'}), 500


@app.route('/profile/<int:student_id>', methods=['GET'])
@jwt_required()
def get_profile(student_id):
    try:
        student = Student.query.get_or_404(student_id)
        profile = student.profile
        
        return jsonify({
            'student': {
                'id': student.id,
                'full_name': student.full_name,
                'email': student.email,
                'interests': student.interests,
                'skill_level': student.skill_level
            },
            'profile': {
                'bio': profile.bio,
                'avatar_url': profile.avatar_url,
                'completed_courses': profile.completed_courses,
                'current_courses': profile.current_courses,
                'achievements': profile.achievements,
                'last_active': profile.last_active.isoformat()
            }
        })
    except Exception as e:
        logger.error(f"Error fetching profile: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    current_user = get_jwt_identity()
    return jsonify({'message': f"Welcome {current_user['email']} to the dashboard!"})


if __name__ == '__main__':
    engine = RecommendationEngine()
    app.run(debug=True)
