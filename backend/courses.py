import pandas as pd
import numpy as np
import os

# Categories with their IDs
categories = {
    1: 'Web Development',
    2: 'Mobile Development',
    3: 'AI/ML',
    4: 'Database Management',
    5: 'Desktop Applications',
    6: 'Programming Languages'
}

# Content types
content_types = ['Video', 'Interactive', 'Project-based', 'Text', 'Mixed']
difficulty_levels = ['Beginner', 'Intermediate', 'Advanced']

# Course templates per category
course_templates = {
    1: ['Frontend Development with {}', 'Backend Development with {}', 'Full Stack {}', 'Modern {} Development'],
    2: ['{} App Development', 'Cross-platform {} Development', 'Native {} Development'],
    3: ['{} Fundamentals', 'Advanced {}', '{} in Practice', 'Applied {}'],
    4: ['{} Database Design', '{} Administration', '{} Performance Tuning', '{} Security'],
    5: ['{} GUI Development', '{} Application Architecture', 'Building {} Apps'],
    6: ['{} Programming', 'Advanced {}', '{} Data Structures', '{} Algorithms']
}

# Technologies per category
technologies = {
    1: ['React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask'],
    2: ['iOS', 'Android', 'React Native', 'Flutter', 'Kotlin'],
    3: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'Computer Vision', 'NLP'],
    4: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle'],
    5: ['PyQt', 'JavaFX', 'Electron', 'WPF', '.NET'],
    6: ['Python', 'Java', 'C++', 'JavaScript', 'Go', 'Rust']
}

# Generate 200 courses
num_courses = 200
courses_data = []
course_id = 1001

for _ in range(num_courses):
    category_id = np.random.randint(1, 7)
    technology = np.random.choice(technologies[category_id])
    course_template = np.random.choice(course_templates[category_id])
    
    courses_data.append({
        'course_id': course_id,
        'course_name': course_template.format(technology),
        'category_id': category_id,
        'content_type': np.random.choice(content_types),
        'difficulty': np.random.choice(difficulty_levels),
        'rating': round(np.random.uniform(3.5, 5.0), 1),
        'average_time': np.random.randint(20, 101)  # hours
    })
    course_id += 1

# Create DataFrame and ensure the 'data' directory exists
df = pd.DataFrame(courses_data)
os.makedirs('data', exist_ok=True)

# Save to CSV
csv_path = 'data/courses.csv'
df.to_csv(csv_path, index=False)

print("Generated courses.csv successfully!")
print("\nSample courses:")
print(df.head())
print("\nCourses per category:")
print(df['category_id'].value_counts())
