import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Quiz = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate('/login');
    }
  }, [user, loadingAuth, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && quizStarted && !quizCompleted && questions.length > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && quizStarted && !quizCompleted) {
      handleNext();
    }
  }, [timer, quizStarted, quizCompleted, questions]);

  const startQuiz = async (topic) => {
    setLoading(true);
    try {
      const response = await fetch('/data/sampleMCQs.json');
      const data = await response.json();

      let topicQuestions = [];
      if (topic === 'dataStructures') topicQuestions = data.dataStructures;
      else if (topic === 'networking') topicQuestions = data.networking;
      else if (topic === 'operatingSystems') topicQuestions = data.operatingSystems;
      else if (topic === 'algorithms') topicQuestions = data.algorithms ? data.algorithms.easy.concat(data.algorithms.medium, data.algorithms.hard) : [];
      else if (topic === 'dbms') topicQuestions = data.dbms ? data.dbms.easy.concat(data.dbms.medium, data.dbms.hard) : [];
      else if (topic === 'aptitude') topicQuestions = data.aptitude ? data.aptitude.easy.concat(data.aptitude.medium, data.aptitude.hard) : [];

      if (topicQuestions.length === 0) {
        alert('No questions available for this topic yet.');
        setLoading(false);
        return;
      }

      setQuestions(topicQuestions);
      setSelectedTopic(topic);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setTimer(30);
      setAnswers([]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Error loading questions. Please try again.');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Record the answer
    setAnswers(prev => [...prev, {
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      options: currentQuestion.options
    }]);

    if (isCorrect) {
      setScore(prev => prev + 1);
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

  const handleRestart = () => {
    setSelectedTopic(null);
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimer(30);
    setAnswers([]);
  };

  const getTopicDisplayName = (topic) => {
    const names = {
      dataStructures: 'Data Structures',
      algorithms: 'Algorithms',
      dbms: 'DBMS',
      operatingSystems: 'Operating Systems',
      networking: 'Networking',
      aptitude: 'Aptitude'
    };
    return names[topic] || topic;
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-lg">🔄 Loading...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const incorrectAnswers = answers.filter(a => !a.isCorrect).length;

    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center text-[var(--primary)]">🎉 Quiz Completed!</h2>
            <h3 className="text-xl font-semibold text-center mb-6">{getTopicDisplayName(selectedTopic)}</h3>

            {/* Score Overview */}
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-[var(--primary)]">{percentage}%</div>
              <div className="text-xl">
                Score: <span className="font-bold text-[var(--primary)]">{score}</span> out of <span className="font-bold">{questions.length}</span>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">✅</div>
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">❌</div>
                <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect Answers</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">📊</div>
                <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
              </div>
            </div>

            {/* Progress Graph */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-center">📈 Performance Graph</h4>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-end space-x-2 h-32">
                  {answers.map((answer, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full rounded-t ${answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ height: `${answer.isCorrect ? '100%' : '60%'}` }}
                      ></div>
                      <span className="text-xs mt-1">{index + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center space-x-6 mt-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span>Incorrect</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold">📝 Detailed Results</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {answers.map((answer, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${answer.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-2">Q{index + 1}: {answer.question}</p>
                        <div className="text-sm space-y-1">
                          <p>Your answer: <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {answer.selectedAnswer !== null ? answer.options[answer.selectedAnswer] : 'Not answered'}
                          </span></p>
                          {!answer.isCorrect && (
                            <p>Correct answer: <span className="text-green-600">{answer.options[answer.correctAnswer]}</span></p>
                          )}
                        </div>
                      </div>
                      <div className={`text-2xl ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {answer.isCorrect ? '✅' : '❌'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="bg-[var(--primary)] hover:bg-[#10b981] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                🔄 Take Another Quiz
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                🏠 Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizStarted && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center mb-2">{getTopicDisplayName(selectedTopic)} Quiz</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium">
                Score: {score}
              </span>
            </div>
            {/* Progress Bar */}
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
            <h3 className="text-xl font-bold mb-6 text-center">
              {currentQuestion.question}
            </h3>

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
              onClick={handleRestart}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🏠 Back to Topics
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

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-[var(--primary)]">🧠 Quiz Center</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Select a topic to begin your quiz journey!</p>
        </div>

        {loading && (
          <div className="text-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading questions...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => startQuiz('dataStructures')}
            className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-[var(--primary)] group"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-bold mb-2">Data Structures</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Master fundamental data structures and algorithms</p>
          </button>

          <button
            onClick={() => startQuiz('algorithms')}
            className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-[var(--primary)] group"
          >
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-bold mb-2">Algorithms</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Explore efficient problem-solving techniques</p>
          </button>

          <button
            onClick={() => startQuiz('dbms')}
            className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-[var(--primary)] group"
          >
            <div className="text-3xl mb-3">🗄️</div>
            <h3 className="text-xl font-bold mb-2">DBMS</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Database management and SQL concepts</p>
          </button>

          <button
            onClick={() => startQuiz('operatingSystems')}
            className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-[var(--primary)] group"
          >
            <div className="text-3xl mb-3">💻</div>
            <h3 className="text-xl font-bold mb-2">Operating Systems</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Process management, memory, and scheduling</p>
          </button>

          <button
            onClick={() => startQuiz('networking')}
            className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-[var(--primary)] group"
          >
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-xl font-bold mb-2">Networking</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Network protocols, architecture, and security</p>
          </button>

          <button
            onClick={() => startQuiz('aptitude')}
            className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-[var(--primary)] group"
          >
            <div className="text-3xl mb-3">🧮</div>
            <h3 className="text-xl font-bold mb-2">Aptitude</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Logical reasoning and quantitative aptitude</p>
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
