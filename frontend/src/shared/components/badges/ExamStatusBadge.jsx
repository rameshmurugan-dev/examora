/**
 * ExamStatusBadge
 * Displays current exam lifecycle state.
 * Supports: DRAFT | PUBLISHED | CLOSED
 */

import { useMemo } from 'react';

const STATUS_STYLES = {
  DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
  PUBLISHED: 'bg-green-100 text-green-800 border-green-200',
  CLOSED: 'bg-red-100 text-red-800 border-red-200',
};

const ExamStatusBadge = ({ status }) => {
  /**
   * Normalize status safely
   */
  const normalizedStatus = useMemo(() => {
    return status?.toUpperCase() || 'DRAFT';
  }, [status]);

  const styleClass =
    STATUS_STYLES[normalizedStatus] || STATUS_STYLES.DRAFT;

  return (
    <span
      className={`
        text-xs font-medium
        px-2.5 py-0.5
        rounded
        border
        ${styleClass}
      `}
    >
      {normalizedStatus}
    </span>
  );
};

export default ExamStatusBadge;