/**
 * ================================================================
 * AttemptResult
 * ================================================================
 * Displays detailed analysis of a submitted attempt.
 *
 * Responsibilities:
 *  - Fetch result summary
 *  - Fetch detailed question answers
 *  - Display score breakdown
 *  - Display per-question review
 * ================================================================
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import Loader from '../../../../shared/components/Loader';
import ScoreSummary from '../components/ScoreSummary';
import AccuracyBreakdown from '../components/AccuracyBreakdown';
import QuestionReviewCard from '../components/QuestionReviewCard';

import {
  getAttemptResult,
  getAttemptAnswers
} from '../services/attemptService';

const AttemptResult = () => {

  /* ============================================================
     ROUTER
  ============================================================ */

  const { attemptId } = useParams();

  /* ============================================================
     STATE
  ============================================================ */

  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState(null);
  const [reviewData, setReviewData] = useState([]);

  /* ============================================================
     FETCH RESULT DATA
  ============================================================ */

  useEffect(() => {

    const fetchResult = async () => {
      try {

        // Parallel Fetch
        const [result, answers] = await Promise.all([
          getAttemptResult(attemptId),
          getAttemptAnswers(attemptId)
        ]);

        setResultData(result);
        setReviewData(answers);

      } catch (err) {
        console.error("Failed to fetch result", err);
        // Same behavior: silently fail & show fallback UI
      } finally {
        setLoading(false);
      }
    };

    fetchResult();

  }, [attemptId]);

  /* ============================================================
     LOADING STATE
  ============================================================ */

  if (loading) return <Loader />;

  /* ============================================================
     FALLBACK STATE
  ============================================================ */

  if (!resultData) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-gray-700">
          Result not found or accessible.
        </h2>
        <Link
          to="/student/dashboard"
          className="text-indigo-600 mt-4 inline-block"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="bg-gray-50 min-h-screen pb-12">

      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Attempt Analysis
          </h1>

          <Link
            to="/student/history"
            className="text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded bg-white"
          >
            &larr; Back to History
          </Link>
        </div>

        {/* Score Summary */}
        <ScoreSummary result={resultData} />

        {/* Accuracy Breakdown */}
        <AccuracyBreakdown result={resultData} />

        {/* Detailed Review */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Detailed Question Review
          </h3>

          {reviewData.map((q, idx) => (
            <QuestionReviewCard
              key={q.id || idx}
              question={q}
              index={idx}
            />
          ))}

          {reviewData.length === 0 && (
            <p className="text-gray-500 italic">
              Detailed review not available.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AttemptResult;