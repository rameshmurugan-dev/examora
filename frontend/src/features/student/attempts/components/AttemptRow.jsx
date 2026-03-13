/**
 * ================================================================
 * AttemptRow
 * ================================================================
 * Displays a single attempt row inside the Attempt History table.
 *
 * Responsibilities:
 *  - Show exam title
 *  - Show start date
 *  - Show score (if submitted)
 *  - Show status badge
 *  - Show action link (Result / Continue)
 * ================================================================
 */

import { Link } from 'react-router-dom';

const AttemptRow = ({ attempt }) => {

    /* ============================================================
       Defensive Guard
    ============================================================ */

    if (!attempt) return null;

    /* ============================================================
       Derived State
    ============================================================ */

    const isSubmitted = attempt.status === 'SUBMITTED';

    const dateStr = attempt.startedAt
        ? new Date(attempt.startedAt).toLocaleDateString()
        : '-';

    const scoreDisplay = isSubmitted
        ? `${attempt.score} / ${attempt.totalMarks}`
        : '-';

    /* ============================================================
       Status Badge
    ============================================================ */

    const badgeElement = isSubmitted
        ? (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                Completed
            </span>
        )
        : (
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold">
                In Progress
            </span>
        );

    /* ============================================================
       Action Link
    ============================================================ */

    const actionElement = isSubmitted
        ? (
            <Link
                to={`/student/attempt/${attempt.id}/result`}
                className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
            >
                View Result
            </Link>
        )
        : (
            <Link
                to={`/student/attempt/${attempt.id}`}
                className="text-green-600 hover:text-green-900 font-medium text-sm"
            >
                Continue Attempt
            </Link>
        );

    /* ============================================================
       Render
    ============================================================ */

    return (
        <tr className="hover:bg-gray-50 transition-colors">

            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {attempt.examTitle}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {dateStr}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {scoreDisplay}
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                {badgeElement}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {actionElement}
            </td>

        </tr>
    );
};

export default AttemptRow;