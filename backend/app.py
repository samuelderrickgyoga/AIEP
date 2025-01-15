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
import time

# Monitoring setup
RECOMMENDATION_LATENCY = Histogram('recommendation_latency_seconds', 'Time spent processing recommendations')
ENGAGEMENT_SCORE_GAUGE = Gauge('engagement_score_average', 'Average engagement score across all students')
MODEL_TRAINING_DURATION = Histogram('model_training_duration_seconds', 'Time spent training models')
INTERACTION_COUNTER = Counter('interaction_total', 'Total number of logged interactions')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

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

    def load_datasets(self) -> None:
        try:
            self.students = pd.read_csv('data/students.csv')
            self.courses = pd.read_csv('data/courses.csv')
            self.engagement = pd.read_csv('data/engagement.csv')
            self.user_item_matrix = self._create_sparse_matrix()
            self.update_available_courses()
            logger.info("Datasets loaded successfully")
        except Exception as e:
            logger.error(f"Error loading datasets: {e}")
            raise

    def load_or_train_models(self) -> None:
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

if __name__ == '__main__':
    engine = RecommendationEngine()
    app.run(debug=True)
