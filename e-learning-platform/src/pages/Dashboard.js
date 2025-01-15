import React from 'react';
import Recommendations from '../components/Recommendations';

const Dashboard = ({ studentId }) => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Recommendations studentId={studentId} />
    </div>
  );
};

export default Dashboard;
