import pandas as pd
from app import db, Course

def import_courses():
    df = pd.read_csv('data/courses.csv')
    
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
