import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function MCQ() {
  const [user, loadingAuth] = useAuthState(auth);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate('/login');
    }
  }, [user, loadingAuth, navigate]);

  // Fetch questions from local JSON
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/src/data/sampleMCQs.json');
        const data = await response.json();
        setQuestions(data.dataStructures || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };

    if (user && !loadingAuth) {
      fetchQuestions();
    }
  }, [user, loadingAuth]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !quizCompleted && questions.length > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !quizCompleted) {
      handleNext();
    }
  }, [timer, quizCompleted, questions]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    // Check if answer is correct
    if (selectedAnswer !== null && questions[currentQuestionIndex]) {
      if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
        setScore(prev => prev + 1);
      }
    }

    // Move to next question or complete quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimer(30);
    } else {
      setQuizCompleted(true);
    }
  };

  if (loadingAuth || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-lg">🔄 Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10 flex justify-center">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-md rounded-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-[var(--primary)]">🎉 Quiz Completed!</h2>
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-[var(--primary)]">{percentage}%</div>
            <div className="text-xl">
              Score: <span className="font-bold text-[var(--primary)]">{score}</span> out of <span className="font-bold">{questions.length}</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[var(--primary)] hover:bg-[#10b981] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🏠 Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10 flex justify-center">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">📚 No Questions Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Unable to load questions.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[var(--primary)] hover:bg-[#10b981] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium">
              Score: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6 text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-lg font-bold text-lg ${
            timer <= 10 ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
          }`}>
            ⏱️ {timer}s
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'border-gray-200 dark:border-gray-600 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5'
                }`}
              >
                <span className="font-medium">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🏠 Back to Dashboard
          </button>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              selectedAnswer === null
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-[var(--primary)] hover:bg-[#10b981] text-white'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? '🎉 Finish Quiz' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MCQ;
