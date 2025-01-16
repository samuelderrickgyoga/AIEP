import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

# Ensure the data directory exists
os.makedirs('data', exist_ok=True)

# Check if required files exist
if not (os.path.exists('data/students.csv') and os.path.exists('data/courses.csv')):
    raise FileNotFoundError("Required files 'students.csv' and 'courses.csv' are missing in the 'data' directory.")

# Load existing students and courses
students_df = pd.read_csv('data/students.csv')
courses_df = pd.read_csv('data/courses.csv')

# Generate engagement data
engagements = []
num_engagements = 1000  # Number of engagement records

for _ in range(num_engagements):
    student_id = np.random.choice(students_df['student_id'])
    course_id = np.random.choice(courses_df['course_id'])
    
    # Generate realistic engagement metrics
    avg_time = courses_df.loc[courses_df['course_id'] == course_id, 'average_time'].values[0]
    time_spent = np.random.normal(0.7, 0.2) * avg_time
    time_spent = max(min(time_spent, 100), 1)  # Bound between 1 and 100 hours
    
    completion_status = np.random.choice([0, 0.25, 0.5, 0.75, 1.0], p=[0.1, 0.2, 0.3, 0.2, 0.2])
    quiz_score = np.random.normal(0.7, 0.15) * 100 if completion_status > 0 else 0
    quiz_score = max(min(quiz_score, 100), 0)  # Bound between 0 and 100
    
    # Refined rating calculation
    base_rating = (completion_status * 0.5 + quiz_score / 100 * 0.5) * 5
    rating = max(min(np.random.normal(base_rating, 0.5), 5), 1)
    
    engagements.append({
        'student_id': student_id,
        'course_id': course_id,
        'time_spent': round(time_spent, 2),
        'quiz_score': round(quiz_score, 2),
        'completion_status': completion_status,
        'rating': round(rating, 1)
    })

# Create DataFrame
engagement_df = pd.DataFrame(engagements)

# Ensure unique student-course combinations
engagement_df = engagement_df.drop_duplicates(subset=['student_id', 'course_id'])

# Save to CSV
engagement_df.to_csv('data/engagement.csv', index=False)

# Print summary statistics
print("Generated 'engagement.csv' with the following statistics:")
print("\nShape:", engagement_df.shape)
print("\nSummary statistics:")
print(engagement_df.describe())
print("\nEngagement distribution:")
print(engagement_df.groupby('completion_status').size())
