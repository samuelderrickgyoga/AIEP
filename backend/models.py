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
