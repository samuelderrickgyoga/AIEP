import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)

# Generate 100 students
num_students = 100

# Lists for generating realistic data
domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']
skill_levels = ['beginner', 'intermediate', 'advanced']
interests = ['Web Development', 'Mobile Development', 'AI/ML',
    'Database Management', 'Desktop Applications', 'Programming Languages']

# Generate student data
students_data = {
    'student_id': range(1001, 1001 + num_students),
    'full_name': [f'Student_{i}' for i in range(1, num_students + 1)],
    'email': [f'student_{i}@{np.random.choice(domains)}' for i in range(1, num_students + 1)],
    'skill_level': np.random.choice(skill_levels, num_students),
    'registration_date': [
        (datetime.now() - timedelta(days=np.random.randint(1, 365))).strftime('%Y-%m-%d')
        for _ in range(num_students)
    ],
    'interests': [
        ','.join(np.random.choice(interests, size=np.random.randint(1, 4), replace=False))
        for _ in range(num_students)
    ],
    'preferences': [
        f"preference_tag_{np.random.randint(1, 6)}" for _ in range(num_students)
    ],
    'active_status': np.random.choice([1, 0], num_students, p=[0.9, 0.1])
}

# Create DataFrame
df = pd.DataFrame(students_data)

# Ensure the 'data' directory exists
os.makedirs('data', exist_ok=True)

# Save to CSV
csv_path = 'data/students.csv'
df.to_csv(csv_path, index=False)

print(f"Generated {csv_path} with the following structure:")
print(df.head())
print("\nDataset shape:", df.shape)
print("\nColumn info:")
print(df.info())
