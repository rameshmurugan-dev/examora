/**
 * ================================================================
 * useExamTimer
 * ================================================================
 * Countdown hook for active exam attempts.
 *
 * Features:
 *  - Calculates remaining time from expiry timestamp
 *  - Auto-triggers onExpire callback
 *  - Cleans interval on unmount
 *  - Prevents duplicate expire calls
 * ================================================================
 */

import { useState, useEffect, useRef } from 'react';

const useExamTimer = (expiryTimestamp, onExpire) => {

    /* ============================================================
       State
    ============================================================ */

    const [secondsRemaining, setSecondsRemaining] =
        useState(0);

    const [isExpired, setIsExpired] =
        useState(false);

    const timerRef = useRef(null);
    const hasExpiredRef = useRef(false);

    /* ============================================================
       Effect
    ============================================================ */

    useEffect(() => {

        if (!expiryTimestamp) return;

        /* --------------------------------------------------------
           Calculate Remaining Time
        -------------------------------------------------------- */

        const calculateRemaining = () => {
            const now = Date.now();
            const end = new Date(expiryTimestamp).getTime();
            const diff = Math.floor((end - now) / 1000);
            return diff > 0 ? diff : 0;
        };

        /* --------------------------------------------------------
           Initial Check
        -------------------------------------------------------- */

        const initialRemaining = calculateRemaining();
        setSecondsRemaining(initialRemaining);

        if (initialRemaining <= 0) {
            setIsExpired(true);

            if (!hasExpiredRef.current && onExpire) {
                hasExpiredRef.current = true;
                onExpire();
            }

            return;
        }

        /* --------------------------------------------------------
           Start Interval
        -------------------------------------------------------- */

        timerRef.current = setInterval(() => {

            const currentRemaining =
                calculateRemaining();

            setSecondsRemaining(currentRemaining);

            if (currentRemaining <= 0) {

                clearInterval(timerRef.current);
                setIsExpired(true);

                if (!hasExpiredRef.current && onExpire) {
                    hasExpiredRef.current = true;
                    onExpire();
                }
            }

        }, 1000);

        /* --------------------------------------------------------
           Cleanup
        -------------------------------------------------------- */

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };

    }, [expiryTimestamp, onExpire]);

    /* ============================================================
       Return API
    ============================================================ */

    return {
        secondsRemaining,
        isExpired
    };
};

export default useExamTimer;