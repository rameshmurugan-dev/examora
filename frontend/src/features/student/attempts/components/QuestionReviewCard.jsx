/**
 * ================================================================
 * QuestionReviewCard
 * ================================================================
 * Displays detailed review of a single question after submission.
 *
 * Shows:
 *  - Question text
 *  - Selected answer
 *  - Correct answer
 *  - Marks awarded
 *  - Status (CORRECT / WRONG / UNATTEMPTED)
 * ================================================================
 */

import React from 'react';

const QuestionReviewCard = ({
    question,
    index
}) => {

    /* ============================================================
       Destructure With Safety
    ============================================================ */

    const {
        questionText,
        options = [],
        selectedOption,
        correctOption,
        marksAwarded,
        status
    } = question || {};

    const isUnattempted = status === 'UNATTEMPTED';
    const isCorrect = status === 'CORRECT';
    const isWrong = status === 'WRONG';

    /* ============================================================
       Card Border Style
    ============================================================ */

    const cardBorderClass =
        isCorrect
            ? 'border-l-4 border-l-green-500'
            : isWrong
                ? 'border-l-4 border-l-red-500'
                : 'border-l-4 border-l-gray-300';

    /* ============================================================
       Render
    ============================================================ */

    return (
        <div
            className={`
                bg-white rounded-lg shadow-sm border p-6 mb-4 transition-all
                ${cardBorderClass}
            `}
        >

            {/* Header */}
            <div className="flex justify-between items-start mb-4">

                <div className="flex gap-3">

                    <span className="font-mono text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Q{index + 1}
                    </span>

                    <h4 className="text-gray-900 font-medium">
                        {questionText}
                    </h4>

                </div>

                <div className="text-right">

                    <span
                        className={`
                            block font-bold
                            ${isCorrect
                                ? 'text-green-600'
                                : isWrong
                                    ? 'text-red-500'
                                    : 'text-gray-400'
                            }
                        `}
                    >
                        {isCorrect ? '+' : ''}
                        {marksAwarded}
                    </span>

                    <span className="text-xs uppercase text-gray-500">
                        {status}
                    </span>

                </div>

            </div>

            {/* Options Review */}
            <div className="space-y-2 ml-11">

                {options.map((opt) => {

                    const isSelected =
                        String(selectedOption) === String(opt.id);

                    const isCorrectOption =
                        String(correctOption) === String(opt.id);

                    let rowClass = 'border-gray-200 bg-white';
                    let label = null;

                    if (isCorrectOption) {
                        rowClass = 'border-green-200 bg-green-50 text-green-800';
                        label = (
                            <span className="text-green-600">
                                ✓ Correct Answer
                            </span>
                        );
                    }

                    if (isSelected && !isCorrectOption) {
                        rowClass = 'border-red-200 bg-red-50 text-red-800';
                        label = (
                            <span className="text-red-600">
                                ✗ Your Answer
                            </span>
                        );
                    }

                    if (isSelected && isCorrectOption) {
                        label = (
                            <span className="text-green-600">
                                ✓ Your Answer
                            </span>
                        );
                    }

                    return (
                        <div
                            key={opt.id}
                            className={`p-3 border rounded-md text-sm flex justify-between ${rowClass}`}
                        >
                            <span>{opt.text}</span>
                            <span className="text-xs font-semibold">
                                {label}
                            </span>
                        </div>
                    );
                })}

                {isUnattempted && (
                    <div className="text-sm text-gray-500 italic">
                        Not Attempted by Student
                    </div>
                )}

            </div>

        </div>
    );
};

export default QuestionReviewCard;