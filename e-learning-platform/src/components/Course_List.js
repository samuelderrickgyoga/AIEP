import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseList = ({ selectedCategories, skillLevel }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams();
        
        selectedCategories.forEach(category => {
          params.append('category_id', category);
        });
        
        if (skillLevel) {
          params.append('difficulty', skillLevel);
        }
        
        const response = await axios.get(`http://localhost:5000/courses?${params.toString()}`);
        
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [selectedCategories, skillLevel]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map(course => (
        <div key={course.course_id} className="border rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold">{course.course_name}</h3>
          <p className="text-sm text-gray-600">Category ID: {course.category_id}</p>
          <p className="text-sm text-gray-600">Difficulty: {course.difficulty}</p>
          <p className="text-sm">Rating: {course.rating || 'N/A'}</p>
          <p className="text-sm">Duration: {course.average_time || 'Unknown'} hours</p>
          <p className="mt-2">{course.features}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
