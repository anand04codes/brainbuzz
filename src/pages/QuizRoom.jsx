import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  getDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';

const QuizRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allReady, setAllReady] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [timer, setTimer] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  // Fetch room data and listen for real-time updates
  useEffect(() => {
    const roomRef = doc(db, 'rooms', roomCode);

    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoomData(data);
        setParticipants(data.participants || []);
        setLoading(false);
      } else {
        alert('Room not found');
        navigate('/room');
      }
    });

    return () => unsubscribe();
  }, [roomCode, navigate]);

  // Join room as participant
  useEffect(() => {
    if (!loading && roomData) {
      const joinRoom = async () => {
        const roomRef = doc(db, 'rooms', roomCode);
        const userId = localStorage.getItem('userId') || Math.random().toString(36).substring(2, 10);
        localStorage.setItem('userId', userId);

        if (!roomData.participants?.some(p => p.id === userId)) {
          await updateDoc(roomRef, {
            participants: arrayUnion({ id: userId, score: 0, ready: false }),
          });
        }
      };
      joinRoom();
    }
  }, [loading, roomData, roomCode]);

  // Check if all participants are ready
  useEffect(() => {
    if (participants.length > 0) {
      const readyCount = participants.filter(p => p.ready).length;
      setAllReady(readyCount === participants.length);
    }
  }, [participants]);

  // Start quiz timer when all ready
  useEffect(() => {
    let interval = null;
    if (allReady && !quizStarted) {
      setQuizStarted(true);
      setTimer(30); // 30 seconds per question or total quiz timer as needed
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [allReady, quizStarted]);

  const handleReady = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    const roomRef = doc(db, 'rooms', roomCode);
    await updateDoc(roomRef, {
      participants: participants.map(p => p.id === userId ? { ...p, ready: true } : p)
    });
    setUserReady(true);
  };

  const handleAnswerSelect = async (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setIsCorrectAnswer(answerIndex === roomData.questions[currentQuestionIndex].correctAnswer);
    setAnswerSubmitted(true);
  };

  const handleNext = async () => {
    if (selectedAnswer === null && !quizStarted) return;

    const roomRef = doc(db, 'rooms', roomCode);
    const userId = localStorage.getItem('userId');

    const currentQuestion = roomData.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Update participant score
    const updatedParticipants = participants.map((p) => {
      if (p.id === userId) {
        return { ...p, score: p.score + (isCorrect ? 1 : 0) };
      }
      return p;
    });

    await updateDoc(roomRef, { participants: updatedParticipants });

    if (currentQuestionIndex < roomData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
      setIsCorrectAnswer(null);
      setTimer(30);
    } else {
      setQuizCompleted(true);
    }
  };

  if (loading) {
    return <div>Loading room data...</div>;
  }

  if (!quizStarted) {
    return (
      <div className="quizroom-container">
        <h2>Room: {roomData.roomName} ({roomCode})</h2>
        <h3>Topic: {roomData.topic}</h3>
        <h4>Participants Ready: {participants.filter(p => p.ready).length} / {participants.length}</h4>
        {!userReady ? (
          <button onClick={handleReady} className="btn bg-green-500 hover:bg-green-600">I'm Ready</button>
        ) : (
          <p>Waiting for other participants...</p>
        )}
      </div>
    );
  }

  if (quizCompleted) {
    const userId = localStorage.getItem('userId');
    const userParticipant = participants.find(p => p.id === userId);
    const userScore = userParticipant ? userParticipant.score : 0;
    const totalQuestions = roomData.questions.length;
    const percentage = ((userScore / totalQuestions) * 100).toFixed(2);
    return (
      <div className="quizroom-container">
        <h2>Quiz Completed!</h2>
        <div className="analysis">
          <h3>Analysis</h3>
          <p>Total Questions: {totalQuestions}</p>
          <p>Correct Answers: {userScore}</p>
          <p>Percentage: {percentage}%</p>
          <p>Score: {userScore}/{totalQuestions}</p>
        </div>
        <button onClick={() => navigate('/leaderboard/' + roomCode)}>View Leaderboard</button>
        <button onClick={() => navigate('/room')}>Back to Rooms</button>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  if (!roomData) {
    return <div>Room data not available.</div>;
  }

  const currentQuestion = roomData.questions[currentQuestionIndex];

  return (
    <div className="quizroom-container">
      <h2>Room: {roomData.roomName} ({roomCode})</h2>
      <h3>Topic: {roomData.topic}</h3>
      <h4>Question {currentQuestionIndex + 1} of {roomData.questions.length}</h4>
      <p>Time Remaining: {timer} seconds</p>
      <p>{currentQuestion.question}</p>
      <div>
        {currentQuestion.options.map((option, idx) => {
          let buttonClass = 'btn bg-gray-200 hover:bg-gray-300 m-2 p-4 rounded';
          if (answerSubmitted) {
            if (idx === selectedAnswer) {
              buttonClass = isCorrectAnswer ? 'btn bg-green-500 text-white m-2 p-4 rounded' : 'btn bg-red-500 text-white m-2 p-4 rounded';
            } else if (idx === currentQuestion.correctAnswer) {
              buttonClass = 'btn bg-green-500 text-white m-2 p-4 rounded';
            }
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(idx)}
              className={buttonClass}
              disabled={answerSubmitted}
            >
              {option}
            </button>
          );
        })}
      </div>
      <button onClick={handleNext} disabled={selectedAnswer === null}>Next</button>
    </div>
  );
};

