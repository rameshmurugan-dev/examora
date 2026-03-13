/**
 * ================================================================
 * ResultSummaryCard
 * ================================================================
 * Displays circular score visualization + summary metrics.
 *
 * IMPORTANT:
 *  - No UI changes
 *  - No behavior changes
 * ================================================================
 */

const ResultSummaryCard = ({
    score,
    totalMarks,
    correctCount,
    wrongCount,
    totalQuestions,
    accuracy
}) => {

    /* ============================================================
       Percentage Calculation (Safe)
    ============================================================ */

    const safeTotal = Number(totalMarks) || 0;
    const safeScore = Number(score) || 0;

    const percentage =
        safeTotal > 0
            ? ((safeScore / safeTotal) * 100).toFixed(1)
            : 0;

    const isPass = percentage >= 35;

    const gradeColor =
        isPass ? 'text-green-600' : 'text-red-600';

    const bgRing =
        isPass
            ? 'ring-green-100 bg-green-50'
            : 'ring-red-100 bg-red-50';

    /* ============================================================
       Render
    ============================================================ */

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

            {/* Circular Score */}
            <div className="text-center mb-6">

                <div
                    className={`w-32 h-32 rounded-full mx-auto flex flex-col justify-center items-center ring-8 ${bgRing} mb-4`}
                >
                    <span className={`text-3xl font-bold ${gradeColor}`}>
                        {percentage}%
                    </span>

                    <span className="text-sm text-gray-500 font-medium">
                        {isPass ? 'PASSED' : 'FAILED'}
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-800">
                    Your Score: {score} / {totalMarks}
                </h2>

            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 border-t pt-6">

                <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-800">
                        {correctCount}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                        Correct
                    </span>
                </div>

                <div className="text-center border-l border-r border-gray-100">
                    <span className="block text-2xl font-bold text-gray-800">
                        {wrongCount}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                        Wrong
                    </span>
                </div>

                <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-800">
                        {accuracy}%
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                        Accuracy
                    </span>
                </div>

            </div>

        </div>
    );
};

export default ResultSummaryCard;