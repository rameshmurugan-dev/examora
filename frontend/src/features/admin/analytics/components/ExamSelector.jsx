/**
 * ExamSelector
 * ----------------------------------------------------
 * Allows admin to select an exam for analytics view.
 * Sticky header for better UX.
 */

import React from 'react';

const ExamSelector = ({
    exams = [],
    selectedExamId,
    onSelect,
    loading = false
}) => {
    const handleChange = (e) => {
        const value = e.target.value;
        onSelect(value ? Number(value) : null);
    };

    return (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm p-4 mb-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Exam Analytics
                    </h1>
                    <p className="text-sm text-gray-500">
                        Select an exam to view detailed performance metrics
                    </p>
                </div>

                <div className="w-full sm:w-auto">
                    <select
                        value={selectedExamId ?? ''}
                        onChange={handleChange}
                        disabled={loading}
                        className="block w-full min-w-[250px] pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="" disabled>
                            -- Select an Exam --
                        </option>

                        {exams.map((exam) => (
                            <option key={exam.examId} value={exam.examId}>
                                {exam.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ExamSelector;