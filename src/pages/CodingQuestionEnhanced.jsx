import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';

const CodingQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [timeComplexity, setTimeComplexity] = useState('');
  const [solvedCount, setSolvedCount] = useState(0);

  const topics = [
    'all', 'Array', 'String', 'Hash Table', 'Dynamic Programming', 'Math',
    'Sorting', 'Greedy', 'Depth-First Search', 'Binary Search', 'Database',
    'Matrix', 'Tree', 'Breadth-First Search', 'Bit Manipulation', 'Two Pointers',
    'Prefix Sum', 'Heap (Priority Queue)', 'Simulation', 'Binary Tree', 'Graph',
    'Stack', 'Counting', 'Sliding Window', 'Design', 'Enumeration', 'Backtracking',
    'Union Find', 'Linked List', 'Number Theory', 'Ordered Set', 'Monotonic Stack',
    'Segment Tree', 'Trie', 'Combinatorics', 'Bitmask', 'Divide and Conquer',
    'Queue', 'Recursion', 'Geometry', 'Binary Indexed Tree', 'Memoization',
    'Hash Function', 'Binary Search Tree', 'Shortest Path', 'String Matching',
    'Topological Sort', 'Rolling Hash', 'Game Theory', 'Interactive', 'Data Stream',
    'Monotonic Queue', 'Brainteaser', 'Doubly-Linked List', 'Randomized',
    'Merge Sort', 'Counting Sort', 'Iterator', 'Concurrency', 'Probability and Statistics',
    'Quickselect', 'Suffix Array', 'Line Sweep', 'Minimum Spanning Tree', 'Bucket Sort',
    'Shell', 'Reservoir Sampling', 'Strongly Connected Component', 'Eulerian Circuit',
    'Radix Sort', 'Rejection Sampling', 'Biconnected Component'
  ];

  useEffect(() => {
    loadAllQuestions();
  }, []);

  useEffect(() => {
    if (allQuestions.length > 0) {
      filterQuestionsByTopic(selectedTopic);
    }
  }, [selectedTopic, allQuestions]);

  useEffect(() => {
    if (filteredQuestions.length > 0) {
      const questionId = id || filteredQuestions[0]?.id;
      const questionIndex = filteredQuestions.findIndex(q => q.id === questionId);
      if (questionIndex !== -1) {
        setCurrentQuestionIndex(questionIndex);
        setQuestion(filteredQuestions[questionIndex]);
        setCode(filteredQuestions[questionIndex]?.starterCode || '');
      }
    }
  }, [filteredQuestions, id]);

  const loadAllQuestions = async () => {
    try {
      const response = await fetch('/data/sampleCodingQs.json');
      const data = await response.json();
      setAllQuestions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading coding questions:', error);
      setLoading(false);
    }
  };

  const filterQuestionsByTopic = (topic) => {
    if (topic === 'all') {
      setFilteredQuestions(allQuestions);
    } else {
      // For now, since sampleCodingQs.json doesn't have topic tags,
      // we'll show all questions. In a real implementation, you'd filter by topic.
      setFilteredQuestions(allQuestions);
    }
  };

  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
    navigate(`/coding-question/${filteredQuestions[0]?.id || 'coding_1'}`);
  };

  const handleQuestionChange = (questionId) => {
    navigate(`/coding-question/${questionId}`);
  };

  const handleRunCode = async () => {
    setRunning(true);
    // Simulate test execution
    setTimeout(() => {
      const mockResults = question?.testCases?.map((testCase, index) => ({
        id: index + 1,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: testCase.expectedOutput, // Mock passing tests
        passed: true
      })) || [];
      setTestResults(mockResults);
      setTimeComplexity('O(n)'); // Mock time complexity
      setRunning(false);
    }, 2000);
  };

  const handleSubmitSolution = () => {
    // Mark as solved and update daily progress
    setSolvedCount(prev => prev + 1);
    alert('Solution submitted successfully! 🎉');
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
          <p className="text-lg">🔄 Loading coding questions...</p>
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
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Questions Solved Today: <span className="font-bold text-[var(--primary)]">{solvedCount}</span>
              </div>
              {question && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </div>
              )}
            </div>
          </div>

          {/* Topic Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Topic:</label>
            <select
              value={selectedTopic}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {topics.map(topic => (
                <option key={topic} value={topic}>
                  {topic === 'all' ? 'All Topics' : topic}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Statement */}
          <div className="space-y-6">
            {/* Question Navigation */}
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Question List</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredQuestions.length} questions
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredQuestions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionChange(q.id)}
                    className={`w-full text-left p-3 mb-2 rounded-lg border transition-colors ${
                      q.id === question?.id
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[var(--primary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{q.title}</span>
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            {question && (
              <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-[var(--primary)]">📝 {question.title}</h2>
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {question.description}
                  </p>
                </div>

                {/* Examples */}
                {question.examples && question.examples.length > 0 && (
                  <div className="mb-6">
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
                  <div>
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
            )}
          </div>

          {/* Code Editor */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-[var(--primary)]">💻 Code Editor</h2>
              <CodeEditor
                code={code}
                onCodeChange={setCode}
                language={question?.language || 'javascript'}
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
                onClick={handleSubmitSolution}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                📤 Submit Solution
              </button>
            </div>

            {/* Test Results */}
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--primary)]">🧪 Test Results</h3>
                {timeComplexity && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Time Complexity: <span className="font-mono font-bold">{timeComplexity}</span>
                  </div>
                )}
              </div>

              {testResults.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tests Passed: <span className="font-bold text-green-600">
                      {testResults.filter(t => t.passed).length}/{testResults.length}
                    </span></span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {testResults.map((result) => (
                      <div key={result.id} className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                          : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Test Case {result.id}</span>
                          <span className={`text-sm font-bold ${
                            result.passed ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result.passed ? '✅ Passed' : '❌ Failed'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Input: {JSON.stringify(result.input)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <div className="text-4xl mb-2">📊</div>
                  <p>Run your code to see test results</p>
                  <p className="text-sm mt-2">Judge0 API integration coming soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingQuestion;
