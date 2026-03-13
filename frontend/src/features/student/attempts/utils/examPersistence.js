/**
 * ================================================================
 * examPersistence
 * ================================================================
 * Handles localStorage persistence for active exam attempts.
 *
 * Purpose:
 *  - Prevent data loss on refresh / crash
 *  - Restore answers on reload
 * ================================================================
 */

const STORAGE_KEY_PREFIX = 'exam_attempt_';

/* ============================================================
   Helpers
============================================================ */

/**
 * Safe JSON parse
 */
const safeParse = (value) => {
    try {
        return JSON.parse(value);
    } catch {
        return {};
    }
};

/**
 * Build storage key
 */
const buildKey = (attemptId) =>
    `${STORAGE_KEY_PREFIX}${attemptId}`;

/* ============================================================
   Public API
============================================================ */

/**
 * Save single answer to localStorage
 */
export const saveAnswerLocal = (
    attemptId,
    questionId,
    answer
) => {
    if (!attemptId || questionId === undefined) return;

    try {
        const key = buildKey(attemptId);

        const currentData = safeParse(
            localStorage.getItem(key) || '{}'
        );

        currentData[questionId] = answer;

        localStorage.setItem(
            key,
            JSON.stringify(currentData)
        );
    } catch (error) {
        console.warn(
            'Failed to save answer locally',
            error
        );
    }
};

/**
 * Retrieve saved answers from localStorage
 */
export const getLocalAnswers = (attemptId) => {
    if (!attemptId) return {};

    try {
        const key = buildKey(attemptId);
        return safeParse(
            localStorage.getItem(key) || '{}'
        );
    } catch {
        return {};
    }
};

/**
 * Clear attempt storage after submission
 */
export const clearLocalAnswers = (attemptId) => {
    if (!attemptId) return;

    try {
        localStorage.removeItem(buildKey(attemptId));
    } catch {
        // Silent fail (no behavior change)
    }
};