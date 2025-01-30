import pandas as pd
from app import db, Course, app  # Ensure you import 'app'
import os

def import_courses():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, 'data')
    
    os.makedirs(data_dir, exist_ok=True)

    courses_path = os.path.join(data_dir, 'courses.csv')
    df = pd.read_csv(courses_path)

    with app.app_context():  # Ensure you're inside the application context
        for _, row in df.iterrows():
            course = Course(
                course_id=row['course_id'],
                course_name=row['course_name'],
                category_id=row['category_id'],
                content_type=row['content_type'],
                difficulty=row['difficulty'],
                rating=row['rating'],
                average_time=row['average_time'],
                features=row['features']
            )
            db.session.add(course)
        
        db.session.commit()
        print('Courses added successfully...')

if __name__ == "__main__":
    import_courses()
