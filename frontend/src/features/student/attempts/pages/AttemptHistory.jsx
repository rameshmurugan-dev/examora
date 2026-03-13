/**
 * ================================================================
 * AttemptHistory
 * ================================================================
 * Displays student's past exam attempts.
 *
 * Responsibilities:
 *  - Fetch attempt history
 *  - Render table of attempts
 *  - Show empty state when no attempts
 * ================================================================
 */

import { useState, useEffect } from 'react';
import AttemptRow from '../../../../components/student/AttemptRow';
import Loader from '../../../../shared/components/Loader';
import { getAttemptHistory } from './attemptService';

const AttemptHistory = () => {

  /* ============================================================
     STATE
  ============================================================ */

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     FETCH HISTORY
  ============================================================ */

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getAttemptHistory();
        setAttempts(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  /* ============================================================
     LOADING SKELETON
  ============================================================ */

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Attempt History
        </h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="animate-pulse divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Attempt History
      </h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exam Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Started
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">

            {attempts.map(attempt => (
              <AttemptRow
                key={attempt.id}
                attempt={attempt}
              />
            ))}

            {attempts.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  You haven't attempted any exams yet.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AttemptHistory;