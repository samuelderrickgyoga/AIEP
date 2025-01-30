from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    interests = db.Column(db.ARRAY(db.String))
    skill_level = db.Column(db.String(20))
    preferred_categories = db.Column(db.ARRAY(db.String))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    profile = db.relationship('StudentProfile', backref='student', uselist=False)
    courses = db.relationship('CourseEnrollment', backref='student')

class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    bio = db.Column(db.Text)
    avatar_url = db.Column(db.String(255))
    social_links = db.Column(db.JSON)
    achievements = db.Column(db.JSON)
    last_login = db.Column(db.DateTime)
    
class Course(db.Model):
    __tablename__ = 'courses'
    
    course_id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(200), nullable=False)
    category_id = db.Column(db.Integer, nullable=False)
    content_type = db.Column(db.String(50))
    difficulty = db.Column(db.String(20))
    rating = db.Column(db.Float)
    average_time = db.Column(db.Integer)
    features = db.Column(db.Text)
    
    enrollments = db.relationship('CourseEnrollment', backref='course')

class CourseEnrollment(db.Model):
    __tablename__ = 'course_enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'))
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)
    completion_status = db.Column(db.String(20), default='enrolled')

class Engagement(db.Model):
    __tablename__ = 'engagements'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable=False)
    time_spent = db.Column(db.Float, nullable=False)  # Time spent on the course (hours)
    quiz_score = db.Column(db.Float, nullable=False)  # Quiz score (0-100)
    completion_status = db.Column(db.Float, nullable=False)  # Completion percentage (0 to 1)
    rating = db.Column(db.Float, nullable=True)  # Student rating (1-5)
    
    # Relationships
    student = db.relationship('Student', backref='engagements')
    course = db.relationship('Course', backref='engagements')