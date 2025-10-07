import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import Confetti from 'react-confetti';

const QuizRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allReady, setAllReady] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [timer, setTimer] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const containerRef = useRef(null);

  // For playing sound
  const successAudioRef = useRef(null);

  // Subscribe to room updates
  useEffect(() => {
    const roomRef = doc(db, 'rooms', roomCode);
    const unsub = onSnapshot(roomRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setRoomData(data);
        setParticipants(data.participants || []);
        setLoading(false);
      } else {
        alert('Room not found');
        navigate('/room');
      }
    });
    return () => unsub();
  }, [roomCode, navigate]);

  // Join room as participant
  useEffect(() => {
    if (!loading && roomData) {
      (async () => {
        const roomRef = doc(db, 'rooms', roomCode);
        let userId = localStorage.getItem('userId');
        if (!userId) {
          userId = Math.random().toString(36).substr(2, 8);
          localStorage.setItem('userId', userId);
        }
        if (!roomData.participants?.some((p) => p.id === userId)) {
          await updateDoc(roomRef, {
            participants: arrayUnion({ id: userId, score: 0, ready: false }),
          });
        }
      })();
    }
  }, [loading, roomData, roomCode]);

  // Check readiness
  useEffect(() => {
    if (participants.length > 0) {
      const countReady = participants.filter((p) => p.ready).length;
      setAllReady(countReady === participants.length);
    }
  }, [participants]);

  // Timer logic once quiz starts
  useEffect(() => {
    let interval = null;
    if (allReady && !quizStarted) {
      setQuizStarted(true);
      setTimer(30);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // submit automatically
            const correct = selectedAnswer === roomData.questions[currentQuestionIndex].correctAnswer;
            setIsCorrectAnswer(correct);
            setAnswerSubmitted(true);
            setTimeout(() => {
              handleNext();
            }, 1500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [allReady, quizStarted, selectedAnswer, currentQuestionIndex, roomData]);

  const handleReady = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    const roomRef = doc(db, 'rooms', roomCode);
    await updateDoc(roomRef, {
      participants: participants.map((p) =>
        p.id === userId ? { ...p, ready: true } : p
      ),
    });
    setUserReady(true);
  };

  const handleAnswerSelect = (idx) => {
    if (answerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleNext = async () => {
    if (selectedAnswer === null && !quizStarted) return;

    const roomRef = doc(db, 'rooms', roomCode);
    const userId = localStorage.getItem('userId');
    const currentQ = roomData.questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQ.correctAnswer;

    // Update participant score
    const updated = participants.map((p) => {
      if (p.id === userId) {
        return { ...p, score: p.score + (correct ? 1 : 0) };
      }
      return p;
    });
    await updateDoc(roomRef, { participants: updated });

    if (currentQuestionIndex < roomData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
      setIsCorrectAnswer(null);
      setTimer(30);
    } else {
      // Play success sound
      successAudioRef.current?.play();
      setQuizCompleted(true);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="animate-pulse text-white text-2xl font-bold">Loading Room...</div>
      </div>
    );
  }

  // Quiz end / completed UI
  if (quizCompleted) {
    const userId = localStorage.getItem('userId');
    const me = participants.find((p) => p.id === userId);
    const myScore = me ? me.score : 0;
    const total = roomData.questions.length;
    const pct = ((myScore / total) * 100).toFixed(1);

    return (
      <div className="relative min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center p-8">
        <Confetti />
        <audio
          ref={successAudioRef}
          id="quizSuccessSound"
          preload="auto"
        >
          <source
            src="data:audio/wav;base64,UklGRiQIAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAIAAAAAAAAAAAAAAAAAAAAAAAA/////wAAAAAAAAAA"
            type="audio/wav"
          />
        </audio>

        <div className="bg-white/90 backdrop-blur-lg border border-white/20 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-fadeInUp">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6">🎉 Quiz Completed!</h2>
          <div className="text-lg text-gray-700 space-y-2 mb-8">
            <p>Total Questions: {total}</p>
            <p>Correct: {myScore}</p>
            <p>Percentage: {pct}%</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => navigate(`/leaderboard/${roomCode}`)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg transition"
            >
              View Leaderboard
            </button>
            <button
              onClick={() => navigate('/room')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-bold shadow-lg transition"
            >
              Back to Rooms
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Before quiz starts (ready screen)
  if (!quizStarted) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-8 flex items-center justify-center overflow-hidden">
        {/* Floating circles / shapes as background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-16 w-32 h-32 bg-indigo-300/30 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-16 right-16 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        </div>

        <div ref={containerRef} className="bg-white/90 backdrop-blur-lg border border-white/20 rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl animate-fadeInUp">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Room: {roomData.roomName}</h2>
          <p className="text-lg text-gray-600 mb-2">Topic: {roomData.topic}</p>
          <p className="text-xl font-mono font-bold text-indigo-600 mb-6">Code: {roomCode}</p>

          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-700 mb-2">Participants Ready:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                    p.ready ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                  title={`User: ${p.id}`}
                >
                  {p.id.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {!userReady ? (
            <button
              onClick={handleReady}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition transform hover:scale-105"
            >
              🚀 I'm Ready
            </button>
          ) : (
            <div className="text-center">
              <p className="text-green-600 text-lg font-semibold animate-pulse">Waiting for others...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main quiz in-progress UI
  const currentQ = roomData.questions[currentQuestionIndex];
  const totalQ = roomData.questions.length;

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex items-center justify-center overflow-hidden">
      {/* SVG wave at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-20 fill-current text-white/20"
        >
          <path d="M-1.41,56.07 C149.99,150.00 271.64,-49.98 501.22,49.98 L500.00,150.00 L0.00,150.00 Z" />
        </svg>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full space-y-8 animate-fadeInUp">
        {/* Progress bar */}
        <div className="">
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-2 bg-indigo-500 transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / totalQ) * 100}%` }}
            ></div>
          </div>
          <p className="mt-1 text-sm text-gray-500 text-right">
            Q {currentQuestionIndex + 1} / {totalQ}
          </p>
        </div>

        {/* Timer bar */}
        <div>
          <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all ${
                timer > 20
                  ? 'bg-green-400'
                  : timer > 10
                  ? 'bg-yellow-400'
                  : 'bg-red-400'
              }`}
              style={{ width: `${(timer / 30) * 100}%` }}
            ></div>
          </div>
          <p className="mt-1 text-sm font-semibold text-white text-right">⏱️ {timer}s</p>
        </div>

        {/* Question */}
        <div>
          <p className="text-2xl font-bold text-gray-800">{currentQ.question}</p>
        </div>

        {/* Options */}
        <div className="grid gap-4">
          {currentQ.options.map((opt, idx) => {
            const isSel = idx === selectedAnswer;
            let cls = 'py-4 px-6 rounded-xl font-semibold text-left shadow-md transition transform';

            if (answerSubmitted) {
              if (idx === selectedAnswer) {
                if (isCorrectAnswer) {
                  cls += ' bg-green-500 text-white scale-105';
                } else {
                  cls += ' bg-red-500 text-white scale-95';
                }
              } else if (idx === currentQ.correctAnswer) {
                cls += ' bg-green-400 text-white';
              } else {
                cls += ' bg-gray-300 text-gray-600';
              }
            } else {
              if (isSel) {
                cls += ' bg-indigo-600 text-white scale-105';
              } else {
                cls += ' bg-gray-100 hover:bg-gray-200 text-gray-800';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                className={cls}
                disabled={answerSubmitted}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <div className="text-center">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105 disabled:scale-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizRoom;
