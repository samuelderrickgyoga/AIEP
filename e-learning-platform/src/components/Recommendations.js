import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Recommendations = ({ studentId }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recommendations?student_id=${studentId}`);
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    if (studentId) fetchRecommendations();
  }, [studentId]);

  return (
    <div>
      <h2>Recommended Courses</h2>
      <ul>
        {recommendations.map((courseId) => (
          <li key={courseId}>{courseId}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
