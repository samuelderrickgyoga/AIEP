// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import ProtectedRoute from './components/ProtectedRoute';
// import Dashboard from './pages/Dashboard';
// import RegistrationForm from './components/RegistrationForm';
// import Login from './components/Login';
// import HomePage from './pages/HomePage';
// import TeacherDashboard from './pages/TeacherDashboard';
// import CourseLearning from './pages/CourseLearning';


// import { API_BASE_URL } from './config/api';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/register" element={<RegistrationForm />} />
//         <Route path="/login" element={<Login />} />
//         <Route 
//           path="/teacher-dashboard/*" 
//           element={
            
//               <TeacherDashboard />
           
//           } 
//         />
//         <Route
//           path="/dashboard/*"
//           element={
//             // <ProtectedRoute>
//               <Dashboard />
//           //   </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//       <Route path="/course/:courseId" element={<CourseLearning />} />
//     </BrowserRouter>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import Login from './components/Login';
import HomePage from './pages/HomePage';
import TeacherDashboard from './pages/TeacherDashboard';
import CourseLearning from './pages/CourseLearning';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher-dashboard/*" element={<TeacherDashboard />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CourseLearning />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
