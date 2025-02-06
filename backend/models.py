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
    streak_days = db.Column(db.Integer, default=0)
    points = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    
    profile = db.relationship('StudentProfile', backref='student', uselist=False)
    courses = db.relationship('CourseEnrollment', backref='student')
    learning_goals = db.relationship('LearningGoal', backref='student')
    activity_logs = db.relationship('ActivityLog', backref='student')

class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    bio = db.Column(db.Text)
    avatar_url = db.Column(db.String(255))
    social_links = db.Column(db.JSON)
    achievements = db.Column(db.JSON)
    last_login = db.Column(db.DateTime)
    notification_preferences = db.Column(db.JSON)
    theme_preference = db.Column(db.String(20), default='light')
    language_preference = db.Column(db.String(10), default='en')

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
    thumbnail_url = db.Column(db.String(255))
    description = db.Column(db.Text)
    prerequisites = db.Column(db.ARRAY(db.String))
    learning_outcomes = db.Column(db.ARRAY(db.String))
    
    enrollments = db.relationship('CourseEnrollment', backref='course')
    modules = db.relationship('CourseModule', backref='course')

class CourseModule(db.Model):
    __tablename__ = 'course_modules'
    
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'))
    title = db.Column(db.String(200))
    order = db.Column(db.Integer)
    content = db.Column(db.Text)
    duration = db.Column(db.Integer)  # in minutes
    resources = db.Column(db.JSON)

class CourseEnrollment(db.Model):
    __tablename__ = 'course_enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'))
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)
    completion_status = db.Column(db.String(20), default='enrolled')
    last_accessed = db.Column(db.DateTime)
    progress = db.Column(db.Float, default=0.0)

class Engagement(db.Model):
    __tablename__ = 'engagements'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable=False)
    time_spent = db.Column(db.Float, nullable=False)
    quiz_score = db.Column(db.Float, nullable=False)
    completion_status = db.Column(db.Float, nullable=False)
    rating = db.Column(db.Float, nullable=True)
    
    student = db.relationship('Student', backref='engagements')
    course = db.relationship('Course', backref='engagements')

class Achievement(db.Model):
    __tablename__ = 'achievements'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    name = db.Column(db.String(100), nullable=False)
    icon = db.Column(db.String(10))
    description = db.Column(db.Text)
    criteria = db.Column(db.JSON)
    points = db.Column(db.Integer, default=0)
    date_earned = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    student = db.relationship('Student', backref='achievements')

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String(50))
    capacity = db.Column(db.Integer)
    location = db.Column(db.String(200))
    host_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    attendees = db.relationship('EventAttendee', backref='event')

class EventAttendee(db.Model):
    __tablename__ = 'event_attendees'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    status = db.Column(db.String(20))  # registered, attended, cancelled
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)

class LearningGoal(db.Model):
    __tablename__ = 'learning_goals'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    target_date = db.Column(db.Date)
    progress = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    activity_type = db.Column(db.String(50))
    description = db.Column(db.Text)
    meta_data = db.Column(db.JSON)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
