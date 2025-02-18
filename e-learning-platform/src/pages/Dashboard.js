import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchStudentProfile,
  fetchRecommendedCourses,
  fetchCourseProgress,
  fetchAchievements,
  fetchEvents
} from '../services/api';
import { FiHome, FiBook, FiAward, FiCalendar, FiSettings, FiUsers, FiLogOut } from 'react-icons/fi';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const HomeContent = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold">Current Progress</h3>
          <div className="mt-4 w-24 h-24 mx-auto">
            <CircularProgressbar
              value={data.progress?.overall || 0}
              text={`${data.progress?.overall || 0}%`}
              styles={{
                path: { stroke: '#fff' },
                text: { fill: '#fff' }
              }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold">Active Courses</h3>
          <p className="text-4xl font-bold mt-4">{data.progress?.activeCourses || 0}</p>
          <p className="mt-2 text-sm">In Progress</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold">Achievements</h3>
          <p className="text-4xl font-bold mt-4">{data.achievements?.length || 0}</p>
          <p className="mt-2 text-sm">Total Earned</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recommended Courses</h3>
          <div className="space-y-4">
            {data.courses?.slice(0, 3).map((course) => (
              <div key={course.course_id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{course.course_name}</h4>
                  <p className="text-sm text-gray-500">Difficulty: {course.difficulty}</p>
                </div>
                <span className="text-sm text-blue-600">
                  {(course.confidence * 100).toFixed(1)}% Match
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Achievements</h3>
          <div className="space-y-4">
            {data.achievements?.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiAward className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.courses?.map((course) => (
          <div key={course.course_id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-200">
              <img
                src={course.thumbnail_url || '/default-course.jpg'}
                alt={course.course_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-lg text-gray-800">{course.course_name}</h4>
              <p className="text-gray-500 mt-2">{course.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-blue-600">
                  {(course.confidence * 100).toFixed(1)}% Match
                </span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AchievementsContent = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.achievements?.map((achievement) => (
          <div key={achievement.id} className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FiAward className="w-10 h-10 text-blue-600" />
            </div>
            <h4 className="font-semibold text-lg text-gray-800">{achievement.name}</h4>
            <p className="text-gray-500 mt-2">{achievement.description}</p>
            <p className="text-sm text-blue-600 mt-4">Earned on {new Date(achievement.date_earned).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventsContent = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        {data.events?.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-blue-100 rounded-xl flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {new Date(event.date).getDate()}
                </span>
                <span className="text-sm text-blue-600">
                  {new Date(event.date).toLocaleString('default', { month: 'short' })}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-800">{event.title}</h4>
                <p className="text-gray-500 mt-2">{event.description}</p>
                <div className="mt-4 flex space-x-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    {event.type}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    {event.location}
                  </span>
                </div>
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                Join Event
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsContent = ({ data }) => {
  const [formData, setFormData] = useState({
    full_name: data.profile?.student.full_name || '',
    email: data.profile?.student.email || '',
    bio: data.profile?.bio || '',
    notification_preferences: data.profile?.notification_preferences || {}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle settings update
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Settings</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    courses: [],
    achievements: [],
    events: [],
    progress: null
  });

  useEffect(() => {
    const studentId = localStorage.getItem('student_id');
    if (!studentId) {
      navigate('/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        const [profile, courses, progress, achievements, events] = await Promise.all([
          fetchStudentProfile(studentId),
          fetchRecommendedCourses(studentId),
          fetchCourseProgress(studentId),
          fetchAchievements(studentId),
          fetchEvents()
        ]);

        setDashboardData({
          profile,
          courses: courses.recommendations,
          progress,
          achievements,
          events
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student_id');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">StudentDashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <img
                  src={dashboardData.profile?.avatar_url || '/default-avatar.png'}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-gray-700">{dashboardData.profile?.student.full_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 bg-white rounded-lg shadow">
            <nav className="mt-5 px-2">
              {[
                { id: 'home', label: 'Home', icon: FiHome },
                { id: 'courses', label: 'Courses', icon: FiBook },
                { id: 'achievements', label: 'Achievements', icon: FiAward },
                { id: 'events', label: 'Events', icon: FiCalendar }, { id: 'settings', label: 'Settings', icon: FiSettings }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${activeSection === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${activeSection === item.id ? 'text-blue-700' : 'text-gray-400'
                    }`} />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow px-6 py-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
