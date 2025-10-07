import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full"></div>
        <div className="absolute top-40 right-40 w-24 h-24 bg-purple-500 rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-pink-500 rounded-full"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-4 animate-fadeInUp">
            Welcome to Your <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 animate-fadeInUp animation-delay-200">
            Choose your learning adventure and start exploring!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            to="/quiz"
            className="group block p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-blue-200 dark:border-blue-700"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:animate-bounce">🧠</div>
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-3">Take a Quiz</h2>
              <p className="text-blue-600 dark:text-blue-300">Test your concepts with MCQ quizzes by topic.</p>
              <div className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold group-hover:bg-blue-700 transition-colors">
                Start Quiz →
              </div>
            </div>
          </Link>

          <Link
            to="/compiler"
            className="group block p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-green-200 dark:border-green-700"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:animate-bounce">💻</div>
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-3">Solve Coding Problems</h2>
              <p className="text-green-600 dark:text-green-300">Use our live compiler to solve coding challenges.</p>
              <div className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold group-hover:bg-green-700 transition-colors">
                Code Now →
              </div>
            </div>
          </Link>

          <Link
            to="/room"
            className="group block p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-purple-200 dark:border-purple-700 sm:col-span-2 lg:col-span-1"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:animate-bounce">👥</div>
              <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-3">Join/Create Room</h2>
              <p className="text-purple-600 dark:text-purple-300">Compete with your friends in real-time rooms.</p>
              <div className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold group-hover:bg-purple-700 transition-colors">
                Enter Room →
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
            <div className="text-gray-600 dark:text-gray-300">Quiz Questions</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-300">Coding Problems</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
            <div className="text-gray-600 dark:text-gray-300">Learning Fun</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-300">Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
