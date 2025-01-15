import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseList = ({ categoryId }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses?category_id=${categoryId}`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    if (categoryId) fetchCourses();
  }, [categoryId]);

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.course_id}>
            {course.course_name} - {course.content_type} - {course.rating}★
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
