import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Replace FiBrain with FiZap for AI-related icons
import { FiUsers, FiActivity, FiZap, FiBook, FiMessageSquare, FiCalendar, FiBarChart2, FiAward } from 'react-icons/fi';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    studentPerformance: null,
    aiInsights: null,
    contentManagement: null,
    communication: null,
    attendance: null,
    gamification: null,
    reports: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       const headers = { Authorization: `Bearer ${token}` };

  //       const [
  //         overviewData,
  //         performanceData,
  //         insightsData,
  //         contentData,
  //         communicationData,
  //         attendanceData,
  //         gamificationData,
  //         reportsData
  //       ] = await Promise.all([
  //         axios.get('/api/dashboard/overview', { headers }),
  //         axios.get('/api/dashboard/student-performance', { headers }),
  //         axios.get('/api/dashboard/ai-insights', { headers }),
  //         axios.get('/api/dashboard/content', { headers }),
  //         axios.get('/api/dashboard/communication', { headers }),
  //         axios.get('/api/dashboard/attendance', { headers }),
  //         axios.get('/api/dashboard/gamification', { headers }),
  //         axios.get('/api/dashboard/reports', { headers })
  //       ]);

  //       setDashboardData({
  //         overview: overviewData.data,
  //         studentPerformance: performanceData.data,
  //         aiInsights: insightsData.data,
  //         contentManagement: contentData.data,
  //         communication: communicationData.data,
  //         attendance: attendanceData.data,
  //         gamification: gamificationData.data,
  //         reports: reportsData.data
  //       });
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);

  const OverviewSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Class Performance</h3>
          <FiActivity className="text-blue-500 w-6 h-6" />
        </div>
        <div className="w-24 h-24 mx-auto">
          <CircularProgressbar
            value={dashboardData.overview?.averagePerformance || 0}
            text={`${dashboardData.overview?.averagePerformance || 0}%`}
            styles={{
              path: { stroke: '#3B82F6' },
              text: { fill: '#3B82F6' }
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Active Students</h3>
          <FiUsers className="text-green-500 w-6 h-6" />
        </div>
        <p className="text-3xl font-bold text-green-500">
          {dashboardData.overview?.activeStudents || 0}
        </p>
        <p className="text-sm text-gray-500 mt-2">Currently Online</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI Insights</h3>
          <FiZap className="text-purple-500 w-6 h-6" />
        </div>
        <p className="text-sm text-gray-600">
          {dashboardData.aiInsights?.latestInsight || 'No insights available'}
        </p>
      </div>

    </div>
  );

  const StudentPerformanceSection = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Student Performance Analytics</h3>
        <button className="text-blue-500 hover:text-blue-700">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dashboardData.studentPerformance?.students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={student.avatar}
                      alt={student.name}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{student.performance}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Teacher Dashboard</h1>
      <OverviewSection />
      <StudentPerformanceSection />
      {/* Add other sections as needed */}
    </div>
  );
};

export default TeacherDashboard;
