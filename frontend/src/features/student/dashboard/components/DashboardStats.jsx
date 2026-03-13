/**
 * ================================================================
 * DashboardStats
 * ================================================================
 * Displays:
 *  - Total Available Exams
 *  - Completed Attempts
 *  - Average Score
 * ================================================================
 */

const DashboardStats = ({ stats }) => {

    /* ============================================================
       Safe Derived Values
    ============================================================ */

    const totalAvailable = stats?.totalAvailable ?? 0;
    const completedAttempts = stats?.completedAttempts ?? 0;

    const averageScore =
        stats?.averageScore !== undefined &&
            stats?.averageScore !== null
            ? `${stats.averageScore}%`
            : 'N/A';

    /* ============================================================
       Render
    ============================================================ */

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Available Exams */}
            <StatCard
                value={totalAvailable}
                label="Available Exams"
                bg="bg-indigo-100"
                text="text-indigo-600"
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                    </svg>
                }
            />

            {/* Completed Attempts */}
            <StatCard
                value={completedAttempts}
                label="Completed Attempts"
                bg="bg-green-100"
                text="text-green-600"
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />

            {/* Average Score */}
            <StatCard
                value={averageScore}
                label="Average Score"
                bg="bg-yellow-100"
                text="text-yellow-600"
                icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                }
            />

        </div>
    );
};

/**
 * Internal reusable stat card (keeps JSX clean)
 */
const StatCard = ({ value, label, bg, text, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`w-12 h-12 ${bg} ${text} rounded-lg flex items-center justify-center`}>
            {icon}
        </div>
        <div>
            <span className="block text-2xl font-bold text-gray-800">{value}</span>
            <span className="text-sm text-gray-500 font-medium">{label}</span>
        </div>
    </div>
);

export default DashboardStats;