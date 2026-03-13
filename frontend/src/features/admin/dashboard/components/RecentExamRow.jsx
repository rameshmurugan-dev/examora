/**
 * RecentExamRow
 * ----------------------------------------------------
 * Displays one row inside dashboard recent exams table.
 * Defensive formatting for attempts & average score.
 */

import React from 'react';
import ExamStatusBadge from '../../../../shared/components/badges/ExamStatusBadge';

const RecentExamRow = ({ exam }) => {
    const attempts = Number(exam.totalAttempts ?? 0);
    const averageScore =
        exam.averageScore != null
            ? `${Number(exam.averageScore).toFixed(1)} marks`
            : '-';

    return (
        <tr className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {exam.title}
            </td>

            <td className="px-6 py-4">
                <ExamStatusBadge status={exam.status} />
            </td>

            <td className="px-6 py-4 text-gray-500">
                {attempts > 0 ? attempts : '-'}
            </td>

            <td className="px-6 py-4">
                {averageScore}
            </td>

            <td className="px-6 py-4 text-right">
                <span className="text-gray-400 text-xs">
                    Read-only
                </span>
            </td>
        </tr>
    );
};

export default RecentExamRow;