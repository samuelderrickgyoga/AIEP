import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Course_List from '../components/Course_List';
import axios from 'axios';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [showCourses, setShowCourses] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    interests: [],
    skillLevel: 'beginner',
    preferredCategories: []
  });

  const skillLevels = ['beginner', 'intermediate', 'advanced'];
  const interestOptions = [
    'Web Development', 'Mobile Development', 'AI/ML',
    'Database Management', 'Desktop Applications', 'Programming Languages'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      const { student_id, token } = response.data;
      
      localStorage.setItem('student_id', student_id);
      localStorage.setItem('token', token);
      
      setShowCourses(true);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            {/* Skill Level Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skill Level
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Interests Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interests
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {interestOptions.map((interest) => (
                  <label key={interest} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      onChange={(e) => {
                        const newInterests = e.target.checked
                          ? [...formData.interests, interest]
                          : formData.interests.filter(i => i !== interest);
                        setFormData({ ...formData, interests: newInterests });
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-600">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
            </button>
          </form>
        </div>
      </div>
      {showCourses && (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4">Recommended Courses</h2>
    <Course_List 
      selectedCategories={formData.interests} 
      skillLevel={formData.skillLevel}
    />
  </div>
)}
    </div>
  );
};

export default RegistrationForm;
