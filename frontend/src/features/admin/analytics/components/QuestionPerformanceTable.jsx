/**
 * QuestionPerformanceTable
 * ----------------------------------------------------
 * Displays per-question performance:
 * - Correct %
 * - Skipped %
 * - Difficulty
 */

import React from 'react';
import DifficultyBadge from '../../../../shared/components/badges/DifficultyBadge';

const QuestionPerformanceTable = ({ questions = [] }) => {
    if (!questions.length) {
        return (
            <div className="bg-white rounded-lg border p-6 text-center text-gray-500 italic">
                No question analytics available.
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    Question Analysis
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/3">
                                Question
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                Correct %
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                Skipped %
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                                Difficulty
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-100">
                        {questions.map((q) => {
                            const correct = Number(q.correctPercentage ?? 0);
                            const skipped = Number(q.skipPercentage ?? 0);

                            return (
                                <tr key={q.questionId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-sm">
                                        {q.questionText}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                        {correct.toFixed(1)}%
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {skipped.toFixed(1)}%
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        <DifficultyBadge level={q.difficultyLevel || 'MEDIUM'} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuestionPerformanceTable;