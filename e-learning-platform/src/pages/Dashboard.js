import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { CircularProgressbar } from 'react-circular-progressbar';
import { FiHome, FiBook, FiAward, FiCalendar, FiSettings, FiUsers, FiLogOut } from 'react-icons/fi';
import ChatButton from '../components/chat/Chatbutton';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    courses: [],
    achievements: [],
    events: [],
    leaderboard: []
  });

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: <FiHome /> },
    { id: 'courses', label: 'My Courses', icon: <FiBook /> },
    { id: 'achievements', label: 'Achievements', icon: <FiAward /> },
    { id: 'events', label: 'Events', icon: <FiCalendar /> },
    { id: 'community', label: 'Community', icon: <FiUsers /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <img
              src={dashboardData.profile?.avatar_url || '/default-avatar.png'}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{dashboardData.profile?.name || 'Student Name'}</h3>
              <p className="text-sm text-gray-500">{dashboardData.profile?.level || 'Beginner'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {dashboardData.profile?.name || 'Student'}!
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Learning Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
              <div className="w-32 h-32 mx-auto">
                <CircularProgressbar
                  value={75}
                  text="75%"
                  styles={{
                    path: { stroke: '#4F46E5' },
                    text: { fill: '#4F46E5', fontSize: '16px' }
                  }}
                />
              </div>
              <p className="text-center mt-4 text-sm text-gray-600">
                5 of 7 learning goals completed
              </p>
            </div>

            {/* Active Courses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Active Courses</h3>
              <div className="space-y-4">
                {dashboardData.courses?.slice(0, 3).map(course => (
                  <div key={course.id} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{course.name}</h4>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      Continue
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
              <div className="grid grid-cols-3 gap-4">
                {dashboardData.achievements?.slice(0, 6).map(achievement => (
                  <div
                    key={achievement.id}
                    className="flex flex-col items-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      {achievement.icon}
                    </div>
                    <span className="text-xs text-center mt-2">
                      {achievement.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.events?.map(event => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-blue-600">
                      {event.date}
                    </span>
                    <span className="text-sm text-gray-500">{event.time}</span>
                  </div>
                  <h4 className="font-semibold mb-2">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Register Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <ChatButton />

   </div>
  );
};

export default Dashboard;
