import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import CategorySelector from './components/CategorySelector';
import CourseList from './components/CourseList';
import Recommendations from './components/RecommendedCourses';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard studentId={101} />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/categories" element={<CategorySelector />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </Router>
  );
}

export default App;
