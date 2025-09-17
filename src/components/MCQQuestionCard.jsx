import React from 'react';

function MCQQuestionCard({ question, options, selectedAnswer, onAnswerSelect, timeLeft, questionNumber, totalQuestions }) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 space-y-4">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-medium">
            ⏱️ {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-xl font-bold mb-6 text-center">
        {question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
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
  );
}

export default MCQQuestionCard;
