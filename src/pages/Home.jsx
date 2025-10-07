import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        document.body.classList.toggle('dark');
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-90"></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-300 opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-300 opacity-15 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-10 w-18 h-18 bg-red-300 opacity-10 rounded-full animate-bounce"></div>
      </div>

      <section className="hero relative z-10 text-center px-6 py-12 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl animate-fadeInUp">
            Welcome to <span className="text-yellow-300">Brain Buzz</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 font-light animate-fadeInUp animation-delay-300">
            Learn, Play, Code — Together in Real-Time
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link
            to="/dashboard"
            className="group relative inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">🚀 Launch Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link
            to="/room"
            className="group relative inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full shadow-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10">👥 Join a Room</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-white mb-2">Interactive Quizzes</h3>
            <p className="text-blue-100">Test your knowledge with engaging MCQ questions</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-semibold text-white mb-2">Live Coding</h3>
            <p className="text-blue-100">Solve coding challenges with our real-time compiler</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-white mb-2">Competitive Rooms</h3>
            <p className="text-blue-100">Compete with friends and climb the leaderboards</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
