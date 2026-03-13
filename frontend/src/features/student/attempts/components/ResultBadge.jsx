/**
 * ================================================================
 * ResultBadge
 * ================================================================
 * Displays PASS / FAIL badge.
 *
 * Logic:
 *  - Uses explicit `passed` flag if provided
 *  - Falls back to 35% threshold rule
 * ================================================================
 */

import React from 'react';

const ResultBadge = ({
    passed,
    score,
    total
}) => {

    /* ============================================================
       Defensive Calculation
    ============================================================ */

    const safeTotal = Number(total) || 0;
    const safeScore = Number(score) || 0;

    const fallbackPass =
        safeTotal > 0
            ? (safeScore / safeTotal) >= 0.35
            : false;

    const isPassed =
        typeof passed === 'boolean'
            ? passed
            : fallbackPass;

    /* ============================================================
       Render
    ============================================================ */

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isPassed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
        >
            {isPassed ? 'PASSED' : 'FAILED'}
        </span>
    );
};

export default ResultBadge;