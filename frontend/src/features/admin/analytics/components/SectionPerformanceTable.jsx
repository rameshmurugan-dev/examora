/**
 * SectionPerformanceTable
 * ----------------------------------------------------
 * Displays section-wise performance:
 * - Question count
 * - Average marks
 * - Accuracy percentage (visual progress bar)
 */

import React from 'react';

const SectionPerformanceTable = ({ sections = [] }) => {
    if (!sections.length) {
        return (
            <div className="bg-white rounded-lg border p-6 text-center text-gray-500 italic">
                No section analytics available.
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    Section Performance
                </h3>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                            Section
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                            Questions
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                            Avg Marks
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                            Accuracy
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                    {sections.map((section) => {
                        const accuracy = Number(section.accuracyPercentage ?? 0);
                        const avgMarks = Number(section.averageMarks ?? 0);

                        const barColor =
                            accuracy >= 70
                                ? 'bg-green-500'
                                : accuracy >= 40
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500';

                        return (
                            <tr key={section.sectionId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {section.sectionName}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {section.questionCount}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {avgMarks.toFixed(1)}
                                </td>

                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${barColor}`}
                                                style={{
                                                    width: `${Math.min(accuracy, 100)}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold">
                                            {accuracy.toFixed(0)}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SectionPerformanceTable;