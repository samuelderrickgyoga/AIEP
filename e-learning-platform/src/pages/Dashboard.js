import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import RecommendedCourses from '../components/RecommendedCourses';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => {
    const [studentData, setStudentData] = useState({
        quizScores: [],
        engagementScores: [],
        courseProgress: [], 
        nextSteps: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard/student/1001');
                const data = await response.json();
                setStudentData(data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome back, {studentData.name}</h1>
                    <p className="text-gray-600">Here's your learning progress</p>
                </div>

                {/* Recommendations Section */}
                <RecommendedCourses studentId={1001} />

                {/* Progress & Analytics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Quiz Performance */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Recent Quiz Scores</h3>
                        <Bar data={studentData.quizScores} />
                    </div>

                    {/* Engagement Score */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Engagement</h3>
                        <Pie data={studentData.engagementScores} />
                    </div>

                    {/* Course Progress */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Course Progress</h3>
                        <div className="w-48 h-48 mx-auto">
                            <CircularProgressbar 
                                value={75} 
                                text={`${75}%`}
                                styles={{
                                    path: { stroke: '#3B82F6' },
                                    text: { fill: '#1F2937' }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Next Steps Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studentData.nextSteps.map((step, index) => (
                            <div 
                                key={index}
                                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                            >
                                <h4 className="font-medium text-gray-800">{step.title}</h4>
                                <p className="text-gray-600 text-sm mt-2">{step.description}</p>
                                <button className="mt-4 text-blue-600 hover:text-blue-700">
                                    Start Now →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
