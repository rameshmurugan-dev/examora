/**
 * ================================================================
 * Timer
 * ================================================================
 * Displays live countdown timer during exam.
 *
 * Features:
 *  - HH:MM:SS formatting (if > 1 hour)
 *  - MM:SS formatting (if < 1 hour)
 *  - Urgent state styling (< 5 minutes)
 * ================================================================
 */

const Timer = ({ secondsRemaining }) => {

    /* ============================================================
       Defensive Normalization
    ============================================================ */

    const safeSeconds =
        typeof secondsRemaining === 'number' && secondsRemaining >= 0
            ? secondsRemaining
            : 0;

    /* ============================================================
       Format Time
    ============================================================ */

    const formatTime = (totalSeconds) => {

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
                .toString()
                .padStart(2, '0')}`;
        }

        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };

    /* ============================================================
       Urgent State
    ============================================================ */

    const isLowTime = safeSeconds < 300; // Less than 5 minutes

    /* ============================================================
       Render
    ============================================================ */

    return (
        <div
            className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-mono text-lg font-bold shadow-sm transition-colors
                ${isLowTime
                    ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                    : 'bg-white text-gray-800 border border-gray-200'
                }
            `}
        >
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>

            <span>{formatTime(safeSeconds)}</span>

        </div>
    );
};

export default Timer;