/**
 * ExamOverviewCards
 * ----------------------------------------------------
 * Displays high-level analytics summary for selected exam.
 * Includes:
 * - Total Attempts
 * - Average Score
 * * - Pass Percentage
 * - Average Completion Time
 *
 * Defensive coding included to prevent NaN / undefined errors.
 */

import React from 'react';

/**
 * Reusable Statistic Card Component
 */
const StatCard = ({ title, value, subtext, color }) => (
    <div className="bg-white shadow rounded-lg border border-gray-100">
        <div className="px-5 py-4">
            <dt className="text-sm font-medium text-gray-500">{title}</dt>
            <dd className={`mt-1 text-3xl font-bold ${color}`}>{value}</dd>
            {subtext && (
                <p className="text-xs text-gray-400 mt-1">{subtext}</p>
            )}
        </div>
    </div>
);

const ExamOverviewCards = ({ stats }) => {
    if (!stats) return null;

    /**
     * Safely format duration (seconds → human readable)
     */
    const formatDuration = (seconds = 0) => {
        if (!seconds || seconds <= 0) return '0m';

        const totalMinutes = Math.floor(seconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    const totalAttempts = stats.totalAttempts ?? 0;
    const hasAttempts = totalAttempts > 0;

    const averageScore = Number(stats.averageScore ?? 0);
    const passPercentage = Number(stats.passPercentage ?? 0);
    const avgCompletionTime = Number(stats.avgCompletionTimeSeconds ?? 0);

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Attempts"
                value={totalAttempts}
                color="text-indigo-600"
            />

            <StatCard
                title="Average Score"
                value={hasAttempts ? averageScore.toFixed(1) : '-'}
                subtext="Across submitted attempts"
                color="text-green-600"
            />

            <StatCard
                title="Pass Percentage"
                value={hasAttempts ? `${passPercentage.toFixed(1)}%` : '-'}
                subtext="Based on pass threshold"
                color="text-blue-600"
            />

            <StatCard
                title="Avg Completion Time"
                value={hasAttempts ? formatDuration(avgCompletionTime) : '-'}
                subtext="Submitted attempts only"
                color="text-orange-600"
            />
        </div>
    );
};

export default ExamOverviewCards;