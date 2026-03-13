/**
 * ================================================================
 * QuestionCard
 * ================================================================
 * Represents a single question row with:
 *  - Expand / Collapse
 *  - Difficulty badge
 *  - Marks display
 *  - Correct answer display
 *  - Option highlighting
 *  - Edit / Delete actions
 * ================================================================
 */

import { useState } from 'react';
import DifficultyBadge from '../../../../shared/components/badges/DifficultyBadge';

const QuestionCard = ({
  question,
  index,
  page,
  pageSize,
  onEditQuestion,
  onDeleteQuestion,
  Icons
}) => {

  /**
   * Local expand state
   * (Previously handled inside QuestionBankLayout)
   */
  const [expanded, setExpanded] = useState(false);

  const isExpanded = expanded;

  return (
    <div
      className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all"
    >

      {/* HEADER */}
      <div className="flex justify-between items-start p-4 border-b">

        <div className="flex-1">

          {/* Question Meta */}
          <div className="flex items-center gap-3 mb-1">

            <span className="text-xs text-gray-500">
              Q{page * pageSize + index + 1}
            </span>

            <DifficultyBadge level={question.difficultyLevel} />

            <span className="text-xs text-gray-500">
              {question.marks} Mark{question.marks > 1 ? 's' : ''}
            </span>

          </div>

          {/* Question Text */}
          <div className="text-sm font-medium text-gray-800">
            {question.questionText}
          </div>

          {/* Correct Answer Display */}
          <div className="text-xs mt-2 text-green-600 font-medium">
            Correct: {question.correctOption}
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">

          <button
            onClick={() => setExpanded(prev => !prev)}
            className="text-gray-500 hover:text-indigo-600 text-lg"
          >
            {isExpanded ? '▲' : '▼'}
          </button>

          <button onClick={() => onEditQuestion(question)}>
            <Icons.Edit />
          </button>

          <button onClick={() => onDeleteQuestion(question)}>
            <Icons.Trash />
          </button>

        </div>

      </div>

      {/* EXPANDED OPTIONS */}
      {isExpanded && (
        <div className="p-4 bg-gray-50 space-y-2 text-sm">

          <div className="text-xs text-gray-500 mb-2">
            Options:
          </div>

          {question.options?.map((opt, i) => {

            const isCorrect = opt === question.correctOption;

            return (
              <div
                key={i}
                className={`px-3 py-2 rounded-md border
                  ${isCorrect
                    ? 'bg-green-100 border-green-300 text-green-700 font-medium'
                    : 'bg-white border-gray-200 text-gray-700'
                  }`}
              >
                {opt}
              </div>
            );

          })}

        </div>
      )}

    </div>
  );
};

export default QuestionCard;