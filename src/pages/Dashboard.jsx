import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/quiz" className="block p-6 border border-gray-300 rounded-lg hover:shadow-md transition">
          <h2 className="text-xl font-semibold">🧠 Take a Quiz</h2>
          <p className="text-gray-600">Test your concepts with MCQ quizzes by topic.</p>
        </Link>
        <Link to="/compiler" className="block p-6 border border-gray-300 rounded-lg hover:shadow-md transition">
          <h2 className="text-xl font-semibold">💻 Solve Coding Problems</h2>
          <p className="text-gray-600">Use our live compiler to solve coding challenges.</p>
        </Link>
        <Link to="/room" className="block p-6 border border-gray-300 rounded-lg hover:shadow-md transition">
          <h2 className="text-xl font-semibold">👥 Join/Create Room</h2>
          <p className="text-gray-600">Compete with your friends in real-time rooms.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
