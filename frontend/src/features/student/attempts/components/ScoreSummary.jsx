/**
 * ================================================================
 * ScoreSummary
 * ================================================================
 * Displays high-level exam result summary.
 *
 * Shows:
 *  - Score
 *  - Percentage
 *  - Pass/Fail badge
 * ================================================================
 */

import React from 'react';
import ResultBadge from './ResultBadge';

const ScoreSummary = ({ result }) => {

    /* ============================================================
       Guard Clause
    ============================================================ */

    if (!result) return null;

    /* ============================================================
       Derived Metrics
    ============================================================ */

    const {
        totalMarks,
        obtainedMarks,
        passed
    } = result;

    const safeTotal = Number(totalMarks) || 0;
    const safeObtained = Number(obtainedMarks) || 0;

    const percentage =
        safeTotal > 0
            ? ((safeObtained / safeTotal) * 100).toFixed(1)
            : 0;

    const percentageColor =
        percentage >= 35
            ? 'text-green-600'
            : 'text-red-600';

    /* ============================================================
       Render
    ============================================================ */

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">

            <div className="md:flex justify-between items-center">

                {/* Left Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Exam Result
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Attempt Completed
                    </p>
                </div>

                {/* Right Section */}
                <div className="mt-4 md:mt-0 flex items-center gap-6">

                    {/* Score */}
                    <div className="text-center">
                        <span className="block text-sm text-gray-500 uppercase tracking-wide">
                            Score
                        </span>
                        <span className="text-3xl font-bold text-gray-900">
                            {obtainedMarks}
                            <span className="text-gray-400 text-lg">
                                /{totalMarks}
                            </span>
                        </span>
                    </div>

                    {/* Percentage */}
                    <div className="text-center border-l px-6">
                        <span className="block text-sm text-gray-500 uppercase tracking-wide">
                            Percentage
                        </span>
                        <span className={`text-xl font-bold ${percentageColor}`}>
                            {percentage}%
                        </span>
                    </div>

                    {/* Badge */}
                    <div>
                        <ResultBadge
                            passed={passed}
                            score={obtainedMarks}
                            total={totalMarks}
                        />
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ScoreSummary;