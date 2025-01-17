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

# Add feature templates for better course descriptions
feature_templates = {
    1: ['Build responsive websites', 'Create modern UIs', 'Handle API integration', 'Implement authentication', 'Database integration'],
    2: ['Cross-platform development', 'Native features access', 'Mobile UI/UX', 'App store deployment', 'Push notifications'],
    3: ['Data preprocessing', 'Model training', 'Neural network architecture', 'Hyperparameter tuning', 'Model deployment'],
    4: ['Schema design', 'Query optimization', 'Data modeling', 'Backup and recovery', 'Security implementation'],
    5: ['UI component design', 'Event handling', 'System integration', 'Cross-platform compatibility', 'Performance optimization'],
    6: ['Object-oriented programming', 'Memory management', 'Concurrent programming', 'Standard libraries', 'Best practices']
}
# Generate 200 courses
num_courses = 200
courses_data = []
course_id = 1001

# Generate 200 courses with features
for _ in range(num_courses):
    category_id = np.random.randint(1, 7)
    technology = np.random.choice(technologies[category_id])
    course_template = np.random.choice(course_templates[category_id])
    
    # Generate rich feature description
    category_features = feature_templates[category_id]
    selected_features = np.random.choice(category_features, size=np.random.randint(2, 5), replace=False)
    feature_text = f"{technology} course covering: {', '.join(selected_features)}. "
    feature_text += f"Perfect for {difficulty_levels[np.random.randint(0, 3)]} learners. "
    feature_text += f"Includes {content_types[np.random.randint(0, 5)]} content."
    
    courses_data.append({
        'course_id': course_id,
        'course_name': course_template.format(technology),
        'category_id': category_id,
        'content_type': np.random.choice(content_types),
        'difficulty': np.random.choice(difficulty_levels),
        'rating': round(np.random.uniform(3.5, 5.0), 1),
        'average_time': np.random.randint(20, 101),
        'features': feature_text
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
