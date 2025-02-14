import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchStudentProfile = async (studentId) => {
  const response = await axios.get(`${API_URL}/profile/${studentId}`);
  return response.data;
};

export const fetchRecommendedCourses = async (studentId) => {
  const response = await axios.get(`${API_URL}/recommendations?student_id=${studentId}`);
  return response.data;
};

export const updateProfile = async (studentId, profileData) => {
  const response = await axios.put(`${API_URL}/profile/${studentId}`, profileData);
  return response.data;
};

export const fetchCourseProgress = async (studentId) => {
  const response = await axios.get(`${API_URL}/progress/${studentId}`);
  return response.data;
};

export const fetchAchievements = async (studentId) => {
  const response = await axios.get(`${API_URL}/achievements/${studentId}`);
  return response.data;
};

export const fetchEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};
