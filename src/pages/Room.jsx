import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

  const generateRoomCode = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleCreateRoom = async () => {
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
      alert('Failed to create room. Please try again.');
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

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">👥 Create or Join a Room</h1>
      <p className="mb-6 text-gray-700">Compete with friends in real-time coding or quiz sessions.</p>

      {!showCreateForm && !showJoinForm && !createdRoom && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn bg-indigo-500 hover:bg-indigo-600"
            >
              Create New Room
            </button>
            <button
              onClick={() => setShowJoinForm(true)}
              className="btn"
            >
              Join Room
            </button>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Create New Room</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Room Name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter room name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quiz Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="dataStructures">Data Structures</option>
                <option value="networking">Networking</option>
                <option value="operatingSystems">Operating Systems</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Students</label>
              <input
                type="number"
                value={numStudents}
                onChange={(e) => setNumStudents(e.target.value)}
                min="1"
                max="50"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mode of Questions</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="MCQ">MCQ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Questions</label>
              <input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                min="1"
                max="20"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreateRoom}
                className="btn bg-green-500 hover:bg-green-600"
              >
                Create Room
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="btn bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showJoinForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Join Room</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room Code</label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter room code"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleJoinRoom}
                className="btn bg-blue-500 hover:bg-blue-600"
              >
                Join Room
              </button>
              <button
                onClick={() => setShowJoinForm(false)}
                className="btn bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {createdRoom && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Room Created Successfully!</h2>
          <div className="space-y-4">
            <div>
              <p className="text-lg"><strong>Room Code:</strong> {createdRoom.code}</p>
              <p className="text-lg"><strong>Room Name:</strong> {createdRoom.roomName}</p>
              <p className="text-lg"><strong>Topic:</strong> {createdRoom.topic}</p>
              <p className="text-lg"><strong>Mode:</strong> {createdRoom.mode}</p>
              <p className="text-lg"><strong>Questions:</strong> {createdRoom.numQuestions}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => shareViaWhatsApp(createdRoom.code)}
                className="btn bg-green-500 hover:bg-green-600"
              >
                Share via WhatsApp
              </button>
              <button
                onClick={() => navigate(`/quizroom/${createdRoom.code}`)}
                className="btn bg-blue-500 hover:bg-blue-600"
              >
                Enter Room
              </button>
              <button
                onClick={() => setCreatedRoom(null)}
                className="btn bg-gray-500 hover:bg-gray-600"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
