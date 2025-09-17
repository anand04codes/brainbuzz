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
    return <div>Loading leaderboard...</div>;
  }

  // Sort participants by score descending
  const sortedParticipants = participants.sort((a, b) => b.score - a.score);

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard for Room {roomCode}</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Participant</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map((participant, index) => (
            <tr key={participant.id}>
              <td>{index + 1}</td>
              <td>{participant.name || participant.id}</td>
              <td>{participant.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/room')}>Create/Join Another Room</button>
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default Leaderboard;
