import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';

const CodingQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    loadQuestion();
  }, [id]);

  const loadQuestion = async () => {
    try {
      const response = await fetch('/data/sampleCodingQs.json');
      const data = await response.json();

      // Find the question by ID or use the first one as default
      const selectedQuestion = data.find(q => q.id === id) || data[0];
      setQuestion(selectedQuestion);
      setCode(selectedQuestion.starterCode);
      setLoading(false);
    } catch (error) {
      console.error('Error loading coding question:', error);
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    setRunning(true);
    // TODO: Integrate Judge0 API for code execution
    setTimeout(() => {
      setRunning(false);
      alert('Code execution feature coming soon! Judge0 API integration needed.');
    }, 2000);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-lg">🔄 Loading coding question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">❌ Question Not Found</h2>
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

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ← Back to Dashboard
            </button>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">{question.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{question.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Statement */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-[var(--primary)]">📝 Problem Description</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {question.description}
                </p>
              </div>
            </div>

            {/* Examples */}
            {question.examples && question.examples.length > 0 && (
              <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-[var(--primary)]">💡 Examples</h3>
                <div className="space-y-4">
                  {question.examples.map((example, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Input:</span>
                          <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                            {example.input}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Output:</span>
                          <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                            {example.output}
                          </code>
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400">Explanation:</span>
                            <p className="ml-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {example.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraints */}
            {question.constraints && question.constraints.length > 0 && (
              <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-[var(--primary)]">⚡ Constraints</h3>
                <ul className="space-y-2">
                  {question.constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[var(--primary)] mr-2">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-[var(--primary)]">💻 Code Editor</h2>
              <CodeEditor
                code={code}
                onCodeChange={setCode}
                language={question.language}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleRunCode}
                disabled={running}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  running
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-[var(--primary)] hover:bg-[#10b981] text-white'
                }`}
              >
                {running ? '⏳ Running...' : '▶️ Run Code'}
              </button>
              <button
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                📤 Submit
              </button>
            </div>

            {/* Test Results Placeholder */}
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-[var(--primary)]">🧪 Test Results</h3>
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <div className="text-4xl mb-2">📊</div>
                <p>Run your code to see test results</p>
                <p className="text-sm mt-2">Judge0 API integration coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingQuestion;
