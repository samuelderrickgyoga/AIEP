import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { CircularProgressbar } from 'react-circular-progressbar';
import { FiHome, FiBook, FiAward, FiCalendar, FiSettings, FiUsers, FiLogOut } from 'react-icons/fi';
import ChatButton from '../components/chat/Chatbutton';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    { id: 'settings', label: 'Settings', icon: <FiSettings /> }
  ];

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomeContent data={dashboardData} />;
      case 'courses':
        return <CoursesContent data={dashboardData} />;
      case 'achievements':
        return <AchievementsContent data={dashboardData} />;
      case 'events':
        return <EventsContent data={dashboardData} />;
      case 'settings':
        return <SettingsContent data={dashboardData} />;
      default:
        return <HomeContent data={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b shadow-lg">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-2xl text-blue-600 font-bold tracking-tight">Phoenix Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <img 
                src="/default-avatar.png" 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div>
                <p className="font-semibold text-gray-800">Dero Tech</p>
                <p className="text-sm text-gray-500">Student</p>
              </div>
            </div>
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block w-64 min-h-screen bg-white shadow-lg">
          <div className="p-6 space-y-6">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity ${
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`bg-white w-64 min-h-screen transform transition-transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6 space-y-6">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ChatButton />
    </div>
  );
};

const HomeContent = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Current Course</h3>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FiBook className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xl font-bold">React Advanced</p>
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2 w-3/4"></div>
            </div>
            <p className="mt-2 text-sm">75% Completed</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Learning Streak</h3>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FiAward className="w-6 h-6" />
            </div>
          </div>
          <p className="text-4xl font-bold">15</p>
          <p className="text-sm mt-2">Days in a row</p>
          <div className="mt-4 flex space-x-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-white/20 rounded-full">
                <div className={`h-full bg-white rounded-full ${i < 5 ? 'w-full' : 'w-0'}`}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Achievements</h3>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FiAward className="w-6 h-6" />
            </div>
          </div>
          <p className="text-4xl font-bold">1,250</p>
          <p className="text-sm mt-2">Experience points</p>
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2 w-1/2"></div>
            </div>
            <p className="mt-2 text-sm">Next level: 2,000 XP</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <FiBook className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Completed React Basics</h4>
                <p className="text-sm text-gray-500">Earned 100 XP • 2 hours ago</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FiAward className="w-4 h-4 text-green-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Upcoming Events</h3>
          <div className="space-y-4">
            {[1, 2].map((event) => (
              <div key={event} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-gray-500">MAR</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">Web Development Workshop</h4>
                  <p className="text-sm text-gray-500">10:00 AM - 12:00 PM</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Learning Goals</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((goal) => (
              <div key={goal} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">Complete React Course</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 rounded-full h-2 w-2/3"></div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">66%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


const CoursesContent = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Course Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold">Active Courses</h3>
          <p className="text-4xl font-bold mt-2">4</p>
          <p className="text-sm mt-1">Currently enrolled</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold">Completed</h3>
          <p className="text-4xl font-bold mt-2">12</p>
          <p className="text-sm mt-1">Courses finished</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold">Total Hours</h3>
          <p className="text-4xl font-bold mt-2">156</p>
          <p className="text-sm mt-1">Learning time</p>
        </div>
      </div>

      {/* Active Courses */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Active Courses</h3>
        <div className="grid gap-6">
          {[1, 2, 3, 4].map((course) => (
            <div key={course} className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <img
                src={`/course-${course}.jpg`}
                alt="Course thumbnail"
                className="w-32 h-32 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">Advanced React Development</h4>
                <p className="text-gray-500 mt-1">Instructor:Dero Tech</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 rounded-full h-2 w-3/4"></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">75% Complete</span>
                    <span className="text-sm text-gray-500">12/16 Modules</span>
                  </div>
                </div>
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                Continue
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const AchievementsContent = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold">Total Badges</h3>
          <p className="text-4xl font-bold mt-2">24</p>
          <p className="text-sm mt-1">Earned so far</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold">Current Level</h3>
          <p className="text-4xl font-bold mt-2">15</p>
          <p className="text-sm mt-1">Expert status</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold">XP Points</h3>
          <p className="text-4xl font-bold mt-2">3,450</p>
          <p className="text-sm mt-1">Total earned</p>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((achievement) => (
            <div key={achievement} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors">
              <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🏆</span>
              </div>
              <h4 className="font-semibold text-gray-800">Course Master</h4>
              <p className="text-sm text-gray-500 mt-2">Complete 5 courses in the same category</p>
              <p className="text-sm text-blue-600 mt-4">Earned 2 days ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const EventsContent = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Upcoming Events Calendar */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Upcoming Events</h3>
        <div className="grid gap-6">
          {[1, 2, 3].map((event) => (
            <div key={event} className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-24 h-24 bg-blue-100 rounded-xl flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">15</span>
                <span className="text-sm text-blue-600">MAR</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-lg font-semibold text-gray-800">Web Development Workshop</h4>
                <p className="text-gray-500 mt-1">Learn the latest web development techniques</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Online</span>
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">2 Hours</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">Beginner</span>
                </div>
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                Join Event
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const SettingsContent = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <img
              src="/default-avatar.png"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-blue-100"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              Change Photo
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dero Tech"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dero@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div>
              <h4 className="font-semibold text-gray-800">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive updates about your courses</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div>
              <h4 className="font-semibold text-gray-800">Course Recommendations</h4>
              <p className="text-sm text-gray-500">Get personalized course suggestions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
