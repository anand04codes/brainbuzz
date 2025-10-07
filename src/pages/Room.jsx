import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import sampleMCQs from '../data/sampleMCQs.json';

const Room = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [topic, setTopic] = useState('dataStructures');
  const [numStudents, setNumStudents] = useState(1);
  const [mode, setMode] = useState('MCQ');
  const [numQuestions, setNumQuestions] = useState(10);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Add mock rooms for testing if none exist
    if (!localStorage.getItem('room_TEST123')) {
      const mockRoom = {
        code: 'TEST123',
        name: 'Test Room',
        topic: 'dataStructures',
        numStudents: 5,
        mode: 'MCQ',
        numQuestions: 10,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('room_TEST123', JSON.stringify(mockRoom));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const generateRoomCode = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleCreateRoom = async () => {
    if (!auth.currentUser) {
      alert('You must be signed in to create a room.');
      return;
    }

    const code = generateRoomCode();
    const topicQuestions = sampleMCQs[topic] || [];
    const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, parseInt(numQuestions));

    const roomData = {
      code,
      roomName,
      topic,
      numStudents: parseInt(numStudents),
      mode,
      numQuestions: parseInt(numQuestions),
      questions: selectedQuestions,
      participants: [],
      status: 'waiting', // waiting, ready, started
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'rooms', code), roomData);
      setCreatedRoom(roomData);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating room:', error);
      alert(`Failed to create room. Error: ${error.message}`);
    }
  };

  const handleJoinRoom = async () => {
    try {
      const roomRef = doc(db, 'rooms', joinCode.toUpperCase());
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        navigate(`/quizroom/${joinCode.toUpperCase()}`);
      } else {
        alert('Room not found. Please check the code.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please try again.');
    }
  };

  const shareViaWhatsApp = (code) => {
    const url = `${window.location.origin}/room`;
    const message = `Join my quiz room! Code: ${code}. Link: ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaSMS = (code, phone) => {
    if (!phone) {
      alert('Please enter a phone number to send SMS.');
      return;
    }
    const url = `${window.location.origin}/room`;
    const message = `Join my quiz room! Code: ${code}. Link: ${url}`;
    const smsUrl = `sms:${phone}?&body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto relative bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-indigo-500 rounded-full filter blur-3xl animate-float opacity-30"></div>
        <div className="absolute top-40 right-40 w-28 h-28 bg-blue-500 rounded-full filter blur-2xl animate-float animation-delay-1000 opacity-30"></div>
        <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-purple-500 rounded-full filter blur-3xl animate-float animation-delay-2000 opacity-30"></div>
        <div className="absolute top-10 right-1/4 w-32 h-32 bg-pink-500 rounded-full filter blur-2xl animate-pulse opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-400 rounded-full filter blur-xl animate-ping opacity-20"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 animate-fadeInUp">
            👥 <span className="text-indigo-700 dark:text-indigo-400">Create or Join a Room</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 animate-fadeInUp animation-delay-200">
            Compete with friends in real-time coding or quiz sessions
          </p>
        </div>

        {!showCreateForm && !showJoinForm && !createdRoom && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div
              onClick={() => setShowCreateForm(true)}
              className="group bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-indigo-300 dark:border-indigo-700 cursor-pointer"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:animate-bounce">🏗️</div>
                <h3 className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-300 mb-3">Create New Room</h3>
                <p className="text-indigo-700 dark:text-indigo-400">Set up a quiz room for your friends</p>
                <div className="mt-4 inline-block px-5 py-3 bg-indigo-700 text-white rounded-full text-sm font-semibold group-hover:bg-indigo-800 shadow-lg transition-colors">
                  Get Started →
                </div>
              </div>
            </div>

            <div
              onClick={() => setShowJoinForm(true)}
              className="group bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-blue-300 dark:border-blue-700 cursor-pointer"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:animate-bounce">🚪</div>
                <h3 className="text-2xl font-extrabold text-blue-900 dark:text-blue-300 mb-3">Join Room</h3>
                <p className="text-blue-700 dark:text-blue-400">Enter details to join the fun</p>
                <div className="mt-4 inline-block px-5 py-3 bg-blue-700 text-white rounded-full text-sm font-semibold group-hover:bg-blue-800 shadow-lg transition-colors">
                  Join Now →
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-green-300 dark:border-green-700">
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:animate-bounce">⚡</div>
                <h3 className="text-2xl font-extrabold text-green-900 dark:text-green-300 mb-3">Quick Enter</h3>
                <p className="text-green-700 dark:text-green-400">Enter room code directly</p>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full mt-4 p-3 border border-green-300 dark:border-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 dark:text-white text-center font-mono text-lg"
                  placeholder="Room Code"
                />
                <button
                  onClick={handleJoinRoom}
                  className="mt-4 inline-block px-6 py-3 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 shadow-lg transition-colors"
                >
                  Enter Room →
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreateForm && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 animate-fadeInUp border border-indigo-300 dark:border-indigo-700">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">🏗️ Create New Room</h2>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-3">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm focus:shadow-indigo-500/50"
                  placeholder="Enter room name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-3">Quiz Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm focus:shadow-indigo-500/50"
                >
                  <option value="dataStructures">Data Structures</option>
                  <option value="networking">Networking</option>
                  <option value="operatingSystems">Operating Systems</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-3">Number of Students</label>
                  <input
                    type="number"
                    value={numStudents}
                    onChange={(e) => setNumStudents(e.target.value)}
                    min="1"
                    max="50"
                    className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm focus:shadow-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-3">Number of Questions</label>
                  <input
                    type="number"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    min="1"
                    max="20"
                    className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm focus:shadow-indigo-500/50"
                  />
                </div>
              </div>
              <div className="flex gap-6 pt-6">
                <button
                  onClick={handleCreateRoom}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-extrabold py-5 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  ✨ Create Room
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-10 py-5 bg-gray-600 hover:bg-gray-700 text-white font-extrabold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showJoinForm && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 animate-fadeInUp border border-blue-300 dark:border-blue-700">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">🚪 Join Room</h2>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-3">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-3">Room Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm text-center text-3xl font-mono tracking-wider"
                  placeholder="Enter room code"
                />
              </div>
              <div className="flex gap-6 pt-6">
                <button
                  onClick={handleJoinRoom}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold py-5 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  🚀 Join Room
                </button>
                <button
                  onClick={() => setShowJoinForm(false)}
                  className="px-10 py-5 bg-gray-600 hover:bg-gray-700 text-white font-extrabold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {createdRoom && (
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-3xl shadow-2xl p-10 animate-fadeInUp border border-green-300 dark:border-green-700 relative overflow-hidden">
            {/* Confetti Animation */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-green-400 rounded-full opacity-75"
                style={{
                  left: `${Math.random() * 100}%`,
                  animation: `confetti 5s linear infinite`,
                  animationDelay: `${i * 0.25}s`,
                  top: '-10px',
                }}
              />
            ))}
            <div className="text-center mb-10 relative z-10">
              <div className="text-7xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-3xl font-extrabold text-green-900 dark:text-green-200 mb-3">Room Created Successfully!</h2>
              <p className="text-green-700 dark:text-green-400 text-lg">Share the room code with your friends</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 mb-10 shadow-xl relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Room Code</p>
                  <p className="text-4xl font-mono font-extrabold text-indigo-700 dark:text-indigo-400 tracking-wider">{createdRoom.code}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Room Name</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{createdRoom.roomName}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Topic</p>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">{createdRoom.topic}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Questions</p>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">{createdRoom.numQuestions}</p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-3">Phone Number for SMS (Optional)</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-5 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm"
                placeholder="Enter phone number for SMS sharing"
              />
            </div>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => navigate(`/quizroom/${createdRoom.code}`)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-extrabold py-5 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                🚀 Enter Room
              </button>
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => shareViaWhatsApp(createdRoom.code)}
                className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-extrabold py-5 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                📱 Share via WhatsApp
              </button>
              <button
                onClick={() => shareViaSMS(createdRoom.code, phoneNumber)}
                className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold py-5 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                📩 Share via SMS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
  