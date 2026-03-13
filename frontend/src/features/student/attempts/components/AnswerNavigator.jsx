/**
 * ================================================================
 * AnswerNavigator
 * ================================================================
 * Displays question palette for quick navigation.
 *
 * Shows:
 *  - Current question
 *  - Answered questions
 *  - Not visited questions
 * ================================================================
 */

import React from 'react';

const AnswerNavigator = ({
    totalQuestions,
    currentQuestionIndex,
    savedAnswers = {},
    onNavigate
}) => {

    /* ============================================================
       Render Question Buttons
    ============================================================ */

    const renderButtons = () => {
        return Array.from({ length: totalQuestions }).map((_, idx) => {

            const isCurrent = idx === currentQuestionIndex;
            const isAnswered = savedAnswers[idx];

            return (
                <button
                    key={idx}
                    onClick={() => onNavigate(idx)}
                    className={`
                        h-10 w-10 text-sm font-medium rounded-md flex items-center justify-center transition-all
                        ${isCurrent
                            ? 'bg-indigo-600 text-white shadow-md ring-2 ring-offset-2 ring-indigo-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        ${!isCurrent && isAnswered
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : ''
                        }
                    `}
                >
                    {idx + 1}
                </button>
            );
        });
    };

    /* ============================================================
       Render
    ============================================================ */

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">

            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                Question Palette
            </h3>

            <div className="grid grid-cols-5 gap-2">
                {renderButtons()}
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-2 text-xs text-gray-500">

                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-indigo-600 rounded-sm"></span>
                    Current
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm"></span>
                    Answered
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm"></span>
                    Not Visited
                </div>

            </div>

        </div>
    );
};

export default AnswerNavigator;