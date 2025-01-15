from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from surprise import SVD, Dataset, Reader
import joblib
from datetime import datetime
import os
from threading import Lock
import logging
from typing import List, Dict, Union
from prometheus_client import Histogram, Counter, Gauge
import time

# Monitoring metrics
RECOMMENDATION_LATENCY = Histogram('recommendation_latency_seconds', 'Time spent processing recommendations')
ENGAGEMENT_SCORE_GAUGE = Gauge('engagement_score_average', 'Average engagement score across all students')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

class RecommendationEngine:
    def __init__(self):
        self.data_lock = Lock()
        self.available_courses_index = set()
        self.load_datasets()
        self.cf_model = None
        self.cbf_model = None
        self.load_or_train_models()

    def load_datasets(self) -> None:
        self.students = pd.read_csv('data/students.csv')
        self.courses = pd.read_csv('data/courses.csv')
        self.engagement = pd.read_csv('data/engagement.csv')
        self.user_item_matrix = self._create_sparse_matrix()
        self.update_available_courses()

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
            scores = self.engagement.groupby('student_id').apply(
                lambda df: self.calculate_engagement_score(df['student_id'].iloc[0])
            )
            scaler = MinMaxScaler()
            normalized_scores = scaler.fit_transform(scores.values.reshape(-1, 1))
            normalized_score = dict(zip(scores.index, normalized_scores))[student_id]
            return normalized_score
        except Exception as e:
            logger.error(f"Error normalizing engagement score for student {student_id}: {e}")
            return 0.0

    async def get_hybrid_recommendations(
        self, 
        student_id: int, 
        n: int = 5
    ) -> Dict[str, Union[List, float]]:
        with RECOMMENDATION_LATENCY.time():
            start_time = time.time()
            
            normalized_engagement = self.normalize_engagement_score(student_id)
            cf_recs = self.get_cf_recommendations(student_id, n)
            cbf_recs = self.get_cbf_recommendations(student_id, n)
            
            hybrid_recs = []
            for rec_set, weight in [(cf_recs, 0.6), (cbf_recs, 0.4)]:
                for course_id, score in rec_set:
                    if course_id in self.available_courses_index:
                        confidence = score * weight * (1 + 0.2 * normalized_engagement)
                        hybrid_recs.append({
                            'course_id': course_id,
                            'confidence': confidence,
                            'engagement_boost': normalized_engagement
                        })
            
            execution_time = time.time() - start_time
            logger.info(f"Generated recommendations for student {student_id} in {execution_time:.2f} seconds")
            
            return {
                'recommendations': sorted(hybrid_recs, key=lambda x: x['confidence'], reverse=True)[:n],
                'engagement_score': normalized_engagement
            }

    async def log_interaction(self, interaction_data: Dict) -> None:
        with self.data_lock:
            if self._validate_interaction(interaction_data):
                self.engagement = self.engagement.append(interaction_data, ignore_index=True)
                self.engagement.to_csv('data/engagement.csv', index=False)
                self.user_item_matrix = self._create_sparse_matrix()
                await self.update_engagement_metrics()

    async def update_engagement_metrics(self):
        avg_score = self.engagement.groupby('student_id').apply(
            lambda df: self.calculate_engagement_score(df['student_id'].iloc[0])
        ).mean()
        ENGAGEMENT_SCORE_GAUGE.set(avg_score)

@app.route('/recommendations/<int:student_id>', methods=['GET'])
async def get_recommendations(student_id: int):
    try:
        result = await engine.get_hybrid_recommendations(student_id)
        return jsonify({
            'student_id': student_id,
            'engagement_score': result['engagement_score'],
            'recommendations': result['recommendations'],
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
