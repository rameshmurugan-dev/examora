/**
 * ================================================================
 * ResultList
 * ================================================================
 * Displays complete result history for student.
 *
 * Responsibilities:
 *  - Fetch attempt history
 *  - Display status (Completed / In Progress)
 *  - Display score badge
 *  - Provide navigation links
 * ================================================================
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Loader from '../../../../shared/components/Loader';
import ResultBadge from '../components/ResultBadge';
import { getAttemptHistory } from '../services/attemptService';

const ResultList = () => {

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
        console.error("Failed to fetch history", err);
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
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Attempt History
        </h1>

        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="animate-pulse divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
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
    <div className="p-8 max-w-7xl mx-auto">

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Attempt History
      </h1>

      {attempts.length === 0 ? (

        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">
            You haven't taken any exams yet.
          </p>
          <Link
            to="/student/exams"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Browse Available Exams &rarr;
          </Link>
        </div>

      ) : (

        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">

          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {attempts.map((attempt) => (
                <tr
                  key={attempt.id}
                  className="hover:bg-gray-50 transition-colors"
                >

                  {/* Exam Title */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {attempt.examTitle}
                    </div>
                    <div className="text-xs text-gray-500">
                      {attempt.totalMarks} mins
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(attempt.startedAt).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attempt.status === 'SUBMITTED' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        In Progress
                      </span>
                    )}
                  </td>

                  {/* Score */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {attempt.status === 'SUBMITTED' ? (
                      <ResultBadge
                        score={attempt.score}
                        total={attempt.totalMarks}
                        passed={attempt.passed}
                      />
                    ) : (
                      '-'
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {attempt.status === 'SUBMITTED' ? (
                      <Link
                        to={`/student/attempt/${attempt.id}/result`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Result
                      </Link>
                    ) : (
                      <Link
                        to={`/student/attempt/${attempt.id}`}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Resume
                      </Link>
                    )}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default ResultList;