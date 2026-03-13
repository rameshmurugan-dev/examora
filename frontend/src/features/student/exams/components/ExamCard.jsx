/**
 * ================================================================
 * ExamCard
 * ================================================================
 * Displays:
 *  - Title
 *  - Duration
 *  - Description
 *  - Marks
 *  - Start button
 * ================================================================
 */

import { Link } from 'react-router-dom';

const ExamCard = ({ exam }) => {

    if (!exam) return null;

    const {
        id,
        title,
        description,
        durationMinutes,
        totalMarks
    } = exam;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">

            <div className="flex-1">

                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                        {title}
                    </h3>

                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded font-medium whitespace-nowrap">
                        {durationMinutes} Mins
                    </span>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {description || 'No description provided.'}
                </p>

                <div className="flex gap-4 text-xs text-gray-500 font-medium">
                    <span>{totalMarks} Marks</span>
                </div>

            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                    to={`/student/exams/${id}`}
                    className="block w-full text-center bg-indigo-600 text-white font-medium py-2 rounded hover:bg-indigo-700 transition-colors"
                >
                    Start Exam
                </Link>
            </div>

        </div>
    );
};

export default ExamCard;