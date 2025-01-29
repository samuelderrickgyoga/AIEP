import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseList = ({ selectedCategories, skillLevel }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategories.length > 0) {
          params.append('category_id', selectedCategories[0]);
        }
        if (skillLevel) {
          params.append('difficulty', skillLevel);
        }
        
        const response = await axios.get(`http://localhost:5000/courses?${params}`);
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
          <p className="text-sm text-gray-600">{course.difficulty}</p>
          <p className="text-sm">Rating: {course.rating}</p>
          <p className="text-sm">Duration: {course.average_time} hours</p>
          <p className="mt-2">{course.features}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
