import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './componants/Navbar';
import Footer from './componants/footer';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Compiler from './pages/Compiler';
import Room from './pages/Room';
import Profile from './pages/profile';
import QuizRoom from './pages/QuizRoom';
import Leaderboard from './pages/Leaderboard';

import Signup from './Signup';
import Login from './Login';
import FloatingChatbot from './components/FloatingChatbot';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/compiler" element={<Compiler />} />
        <Route path="/room" element={<Room />} />
        <Route path="/quizroom/:roomCode" element={<QuizRoom />} />
        <Route path="/leaderboard/:roomCode" element={<Leaderboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
      <FloatingChatbot />
    </Router>
  );
};

export default App;
