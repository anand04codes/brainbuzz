import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';

const Compiler = () => {
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
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [executionOutput, setExecutionOutput] = useState('');
  const [executionTime, setExecutionTime] = useState('');
  const [executionMemory, setExecutionMemory] = useState('');

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

  const languages = [
    { id: 63, name: 'JavaScript', value: 'javascript' },
    { id: 54, name: 'C++', value: 'cpp' },
    { id: 62, name: 'Java', value: 'java' },
    { id: 50, name: 'C', value: 'c' }
  ];

  const languageStarters = {
    javascript: `function solution() {
    // Write your JavaScript code here
    console.log("Hello, World!");
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your C++ code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
    java: `public class Main {
    public static void main(String[] args) {
        // Write your Java code here
        System.out.println("Hello, World!");
    }
}`,
    c: `#include <stdio.h>

int main() {
    // Write your C code here
    printf("Hello, World!\\n");
    return 0;
}`
  };

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
        setCode(filteredQuestions[questionIndex]?.starterCode || languageStarters[selectedLanguage]);
      }
    }
  }, [filteredQuestions, id, selectedLanguage]);

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
    navigate(`/compiler/${filteredQuestions[0]?.id || 'coding_1'}`);
  };

  const handleQuestionChange = (questionId) => {
    navigate(`/compiler/${questionId}`);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCode(languageStarters[language]);
  };

  const executeCode = async (sourceCode, languageId, input = '') => {
    const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with your actual API key
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: sourceCode,
        stdin: input
      })
    });

    const data = await response.json();
    return data.token;
  };

  const getExecutionResult = async (token) => {
    const response = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with your actual API key
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    });

    const data = await response.json();
    return data;
  };

  const handleRunCode = async () => {
    setRunning(true);
    setExecutionOutput('');
    setExecutionTime('');
    setExecutionMemory('');

    try {
      const languageObj = languages.find(lang => lang.value === selectedLanguage);
      if (!languageObj) {
        alert('Language not supported');
        setRunning(false);
        return;
      }

      // Execute the code
      const token = await executeCode(code, languageObj.id);

      // Wait a bit for execution
      setTimeout(async () => {
        const result = await getExecutionResult(token);

        if (result.status?.id === 3) { // Accepted
          setExecutionOutput(result.stdout || 'No output');
          setExecutionTime(result.time || 'N/A');
          setExecutionMemory(result.memory || 'N/A');
          setTimeComplexity('O(1)'); // Mock time complexity
        } else {
          setExecutionOutput(result.stderr || result.compile_output || 'Execution failed');
        }

        setRunning(false);
      }, 2000);

    } catch (error) {
      console.error('Error executing code:', error);
      setExecutionOutput('Error executing code. Please check your internet connection.');
      setRunning(false);
    }
  };

  const handleSubmitSolution = () => {
    // Mark as solved and update daily progress
    setSolvedCount(prev => prev + 1);
    alert('Solution submitted successfully! 🎉');
  };

  const handleClearCode = () => {
    setCode(languageStarters[selectedLanguage]);
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
            <h1 className="text-3xl font-bold text-[var(--primary)]">💻 Coding Practice</h1>
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

          {/* Controls */}
          <div className="flex gap-4 mb-4">
            {/* Topic Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Select Topic:</label>
              <select
                value={selectedTopic}
                onChange={(e) => handleTopicChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic === 'all' ? 'All Topics' : topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Select Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Statement */}
          <div className="space-y-6">
            {/* Question Navigation */}
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Question List</h3>
                <div className="flex gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredQuestions.length} questions
                  </span>
                  <button
                    onClick={() => setShowQuestionList(!showQuestionList)}
                    className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {showQuestionList ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              {showQuestionList && (
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
              )}
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
                language={selectedLanguage}
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
              <button
                onClick={handleClearCode}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                🗑️ Clear
              </button>
            </div>

            {/* Execution Output */}
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--primary)]">📤 Execution Output</h3>
                {timeComplexity && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Time Complexity: <span className="font-mono font-bold">{timeComplexity}</span>
                  </div>
                )}
              </div>

              {executionOutput ? (
                <div className="space-y-3">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                    <pre className="whitespace-pre-wrap">{executionOutput}</pre>
                  </div>
                  {(executionTime || executionMemory) && (
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                      {executionTime && <span>Time: {executionTime}s</span>}
                      {executionMemory && <span>Memory: {executionMemory}KB</span>}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <div className="text-4xl mb-2">🚀</div>
                  <p>Run your code to see the output</p>
                  <p className="text-sm mt-2">Supports C++, Java, C, and JavaScript</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
