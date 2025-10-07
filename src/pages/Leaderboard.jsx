import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Leaderboard = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roomRef = doc(db, 'rooms', roomCode);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setParticipants(data.participants || []);
        setLoading(false);
      } else {
        alert('Room not found');
        navigate('/room');
      }
    });
    return () => unsubscribe();
  }, [roomCode, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 animate-backgroundFade">
        <div className="text-white text-2xl font-bold animate-pulse">Loading Leaderboard...</div>
      </div>
    );
  }

  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return { bg: 'bg-yellow-400 text-yellow-900 shadow-xl', icon: '🏆', size: 'text-3xl' };
      case 2:
        return { bg: 'bg-gray-300 text-gray-800 shadow-lg', icon: '🥈', size: 'text-2xl' };
      case 3:
        return { bg: 'bg-amber-700 text-white shadow-lg', icon: '🥉', size: 'text-2xl' };
      default:
        return { bg: 'bg-indigo-100 text-indigo-700', icon: `${rank}`, size: 'text-xl' };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 py-12 px-4">
      <div className="w-full max-w-4xl p-10 bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 transition-all duration-300">
        <h2 className="text-4xl font-extrabold text-white mb-10 text-center drop-shadow-md">
          🎉 Leaderboard - Room <span className="text-yellow-300">{roomCode}</span>
        </h2>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full table-auto border-collapse shadow-lg backdrop-blur">
            <thead>
              <tr className="bg-white/20 text-white text-lg uppercase tracking-wider">
                <th className="px-6 py-4 text-left">Rank</th>
                <th className="px-6 py-4 text-left">Participant</th>
                <th className="px-6 py-4 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedParticipants.map((participant, index) => {
                const { bg, icon, size } = getRankBadge(index + 1);
                return (
                  <tr
                    key={participant.id}
                    className={`backdrop-blur-sm ${index % 2 === 0 ? 'bg-white/10' : 'bg-white/5'} hover:scale-[1.02] hover:shadow-md transition-transform duration-300`}
                  >
                    <td className="px-6 py-4">
                      <div className={`w-14 h-14 flex items-center justify-center rounded-full font-bold ${bg}`}>
                        <span className={`${size}`}>{icon}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-lg font-medium text-white">{participant.name || participant.id}</td>
                    <td className="px-6 py-4 text-lg font-bold text-white">{participant.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate('/room')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            🔁 Create/Join Another Room
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
