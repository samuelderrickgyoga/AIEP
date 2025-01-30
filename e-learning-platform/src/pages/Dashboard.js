import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import axios from 'axios';
import ChatButton from '../components/chat/Chatbutton';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    recommendations: [],
    engagementMetrics: null,
    contentPerformance: null,
    profile: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const studentId = localStorage.getItem('student_id');
        const token = localStorage.getItem('token');
        
        const headers = { Authorization: `Bearer ${token}` };
        const BASE_URL = 'http://localhost:5000';
        const [recommendations, metrics, performance, profile] = await Promise.all([
            axios.get(`${BASE_URL}/recommendations/${studentId}`, { headers }),
            axios.get(`${BASE_URL}/metrics/engagement/${studentId}`, { headers }),
            axios.get(`${BASE_URL}/metrics/content-performance`, { headers }),
            axios.get(`${BASE_URL}/profile/${studentId}`, { headers })
          ]);

        setDashboardData({
          recommendations: recommendations.data.recommendations,
          engagementMetrics: metrics.data.progress_metrics,
          contentPerformance: performance.data,
          profile: profile.data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderEngagementChart = () => {
    const data = {
      labels: ['Quiz Performance', 'Course Completion', 'Engagement Score'],
      datasets: [{
        data: [
          dashboardData.engagementMetrics?.quiz_performance || 0,
          dashboardData.engagementMetrics?.completed_courses || 0,
          dashboardData.engagementMetrics?.engagement_score * 100 || 0
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };

    return <Pie data={data} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Learning Dashboard</h1>
            </div>
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full"
                src={dashboardData.profile?.avatar_url || 'default-avatar.png'}
                alt="Profile"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Progress Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-24 h-24 mx-auto mb-4">
              <CircularProgressbar
                value={dashboardData.engagementMetrics?.engagement_score * 100 || 0}
                text={`${Math.round(dashboardData.engagementMetrics?.engagement_score * 100 || 0)}%`}
                styles={buildStyles({
                  pathColor: `#4F46E5`,
                  textColor: '#4F46E5',
                })}
              />
            </div>
            <h3 className="text-lg font-semibold text-center">Overall Progress</h3>
          </div>

          {/* Other Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Learning Stats</h3>
            {renderEngagementChart()}
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <div className="space-y-4">
              {dashboardData.profile?.achievements?.map((achievement, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-2">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Recommended Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.recommendations.map((course, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold">{course.course_name}</h3>
                <p className="text-sm text-gray-600 mt-2">{course.features}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {course.difficulty}
                  </span>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Learning Activity</h2>
          <div className="h-64">
            <Line
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  label: 'Hours Spent Learning',
                  data: [2, 4, 3, 5, 3, 4, 2],
                  borderColor: '#4F46E5',
                  tension: 0.4
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        </div>
      </main>
      <ChatButton />
    </div>
  );
};

export default Dashboard;
