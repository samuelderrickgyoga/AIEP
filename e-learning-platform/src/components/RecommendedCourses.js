import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecommendedCourses = ({ studentId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/recommendations?student_id=${studentId}`);
                setRecommendations(response.data.recommendations);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchRecommendations();
        }
    }, [studentId]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Recommended for You</h3>
            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendations.map((course) => (
                        <div key={course.course_id} 
                             className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-lg">{course.course_name}</h4>
                            <p className="text-gray-600">Category ID: {course.category_id}</p>
                            <p className="text-gray-600">Difficulty: {course.difficulty}</p>
                            <p className="text-gray-600">Estimated Time: {course.average_time} hours</p>
                            <div className="mt-2 text-sm text-blue-600">
                                Confidence: {(course.confidence * 100).toFixed(1)}%
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecommendedCourses;
