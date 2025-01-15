from flask import Flask, request, jsonify
import pandas as pd

# Load datasets
students = pd.read_csv('data/students.csv')
categories = pd.read_csv('data/categories.csv')
courses = pd.read_csv('data/courses.csv')
engagement = pd.read_csv('data/engagement.csv')

def get_student_data(student_id):
    return students[students['student_id'] == student_id].iloc[0]

def get_courses_by_category(category_id):
    return courses[courses['category_id'] == category_id]
app = Flask(__name__)

# Load datasets
students = pd.read_csv('data/students.csv')
categories = pd.read_csv('data/categories.csv')
courses = pd.read_csv('data/courses.csv')
engagement = pd.read_csv('data/engagement.csv')

@app.route('/register', methods=['POST'])
def register_student():
    data = request.json
    students.loc[len(students)] = data
    students.to_csv('data/students.csv', index=False)
    return jsonify({'message': 'Student registered successfully!'})

@app.route('/categories', methods=['GET'])
def get_categories():
    return jsonify(categories.to_dict(orient='records'))

@app.route('/courses', methods=['GET'])
def get_courses():
    category_id = request.args.get('category_id', type=int)
    filtered_courses = courses[courses['category_id'] == category_id]
    return jsonify(filtered_courses.to_dict(orient='records'))

@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    student_id = request.args.get('student_id', type=int)
    recommendations = recommend_courses(student_id)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)