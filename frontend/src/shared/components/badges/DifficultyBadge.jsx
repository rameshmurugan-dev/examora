/**
 * DifficultyBadge
 * Visual indicator for question complexity level.
 * Supports: EASY | MEDIUM | HARD
 */

import { useMemo } from 'react';

const DIFFICULTY_STYLES = {
  EASY: 'bg-green-100 text-green-800 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HARD: 'bg-red-100 text-red-800 border-red-200',
  UNKNOWN: 'bg-gray-100 text-gray-800 border-gray-200',
};

const DifficultyBadge = ({ level }) => {
  /**
   * Normalize difficulty level safely
   */
  const normalizedLevel = useMemo(() => {
    return level?.toUpperCase() || 'UNKNOWN';
  }, [level]);

  const styleClass =
    DIFFICULTY_STYLES[normalizedLevel] || DIFFICULTY_STYLES.UNKNOWN;

  return (
    <span
      className={`
        px-2.5 py-0.5
        rounded-full
        text-xs font-medium
        border
        ${styleClass}
      `}
    >
      {normalizedLevel}
    </span>
  );
};

export default DifficultyBadge;