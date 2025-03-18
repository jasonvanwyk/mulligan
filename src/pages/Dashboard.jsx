import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <h1 className="text-4xl font-bold text-indigo-600">
        Mulligan main menu
      </h1>
    </div>
  );
};

export default Dashboard;