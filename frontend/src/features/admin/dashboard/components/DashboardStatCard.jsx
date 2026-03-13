/**
 * DashboardStatCard
 * ----------------------------------------------------
 * Displays a single dashboard metric with icon + color.
 * Safe number formatting included.
 */

import React from 'react';

const DashboardStatCard = ({
    label,
    value,
    color = 'indigo'
}) => {

    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        yellow: 'bg-yellow-50 text-yellow-600',
    };

    const activeColor = colorClasses[color] || colorClasses.indigo;

    const formattedValue =
        typeof value === 'number'
            ? value.toLocaleString()
            : value ?? '-';

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
            <div className={`p-3 rounded-full mr-4 ${activeColor}`}>
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>

            <div>
                <p className="mb-2 text-sm font-medium text-gray-600">
                    {label}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                    {formattedValue}
                </p>
            </div>
        </div>
    );
};

export default DashboardStatCard;