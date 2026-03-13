/**
 * ================================================================
 * ExamHeader
 * ================================================================
 * Persistent header shown during active exam attempt.
 *
 * Displays:
 *  - Exam Title
 *  - Candidate Name
 *  - Countdown Timer
 * ================================================================
 */

import Timer from './Timer';

const ExamHeader = ({
    examTitle,
    studentName,
    secondsRemaining
}) => {

    /* ============================================================
       Fallback Values
    ============================================================ */

    const title = examTitle || 'Exam In Progress';
    const candidateName = studentName || '';

    /* ============================================================
       Render
    ============================================================ */

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

                {/* Left: Title + Candidate */}
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">
                        {title}
                    </h1>
                    <span className="text-sm text-gray-500">
                        Candidate: {candidateName}
                    </span>
                </div>

                {/* Right: Timer */}
                <div className="flex items-center gap-4">

                    <div className="text-right hidden sm:block">
                        <span className="block text-xs text-gray-400 uppercase tracking-widest">
                            Time Remaining
                        </span>
                    </div>

                    <Timer secondsRemaining={secondsRemaining} />

                </div>

            </div>

        </header>
    );
};

export default ExamHeader;