/**
 * ================================================================
 * AccuracyBreakdown
 * ================================================================
 * Displays performance breakdown using:
 *  - Correct answers
 *  - Wrong answers
 *  - Skipped answers
 *  - Accuracy %
 *  - Completion %
 * ================================================================
 */

import React from 'react';

const AccuracyBreakdown = ({ result }) => {

    /* ============================================================
       Guard Clause
    ============================================================ */

    if (!result) return null;

    /* ============================================================
       Derived Statistics (Safe Defaults)
    ============================================================ */

    const total = Number(result.totalQuestions) || 0;
    const correct = Number(result.correctCount) || 0;
    const wrong = Number(result.wrongCount) || 0;

    const skipped = Math.max(total - correct - wrong, 0);

    const correctPercent = total ? (correct / total) * 100 : 0;
    const wrongPercent = total ? (wrong / total) * 100 : 0;
    const skippedPercent = total ? (skipped / total) * 100 : 0;

    /* ============================================================
       Render
    ============================================================ */

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">

            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Performance Analysis
            </h3>

            {/* Progress Bar */}
            <div className="flex bg-gray-100 rounded-full h-4 overflow-hidden mb-4">
                <div
                    className="bg-green-500 h-full"
                    style={{ width: `${correctPercent}%` }}
                    title="Correct"
                />
                <div
                    className="bg-red-500 h-full"
                    style={{ width: `${wrongPercent}%` }}
                    title="Wrong"
                />
                <div
                    className="bg-gray-400 h-full"
                    style={{ width: `${skippedPercent}%` }}
                    title="Skipped"
                />
            </div>

            {/* Count Cards */}
            <div className="grid grid-cols-3 gap-4 text-center">

                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <span className="block text-2xl font-bold text-green-700">
                        {correct}
                    </span>
                    <span className="text-xs font-medium text-green-600 uppercase">
                        Correct
                    </span>
                </div>

                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="block text-2xl font-bold text-red-700">
                        {wrong}
                    </span>
                    <span className="text-xs font-medium text-red-600 uppercase">
                        Wrong
                    </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="block text-2xl font-bold text-gray-700">
                        {skipped}
                    </span>
                    <span className="text-xs font-medium text-gray-600 uppercase">
                        Skipped
                    </span>
                </div>

            </div>

            {/* Footer Metrics */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">

                <p>
                    Accuracy:{' '}
                    <span className="font-semibold text-gray-900">
                        {correctPercent.toFixed(1)}%
                    </span>
                </p>

                <p>
                    Completion:{' '}
                    <span className="font-semibold text-gray-900">
                        {(100 - skippedPercent).toFixed(1)}%
                    </span>
                </p>

            </div>

        </div>
    );
};

export default AccuracyBreakdown;