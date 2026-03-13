/**
 * ================================================================
 * AttemptReview
 * ================================================================
 * Read-only review mode for submitted attempts.
 *
 * Responsibilities:
 *  - Security check (must be SUBMITTED)
 *  - Load attempt questions
 *  - Display correct answers + selected answers
 * ================================================================
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import Loader from '../../../../shared/components/Loader';
import QuestionReviewCard from '../components/QuestionReviewCard';

import {
  getAttemptReviewDetails,
  getAttemptQuestions
} from '../services/attemptService';

const AttemptReview = () => {

  /* ============================================================
     ROUTER
  ============================================================ */

  const { attemptId } = useParams();
  const navigate = useNavigate();

  /* ============================================================
     STATE
  ============================================================ */

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  /* ============================================================
     FETCH REVIEW DATA
  ============================================================ */

  useEffect(() => {

    const fetchReviewData = async () => {

      try {
        /* -----------------------------------------
           Security Check
        ----------------------------------------- */

        const attemptDetails =
          await getAttemptReviewDetails(attemptId);

        if (attemptDetails.status !== 'SUBMITTED') {
          navigate('/student/dashboard');
          return;
        }

        /* -----------------------------------------
           Fetch Questions
        ----------------------------------------- */

        const questionData =
          await getAttemptQuestions(attemptId);

        setQuestions(questionData);

        /* -----------------------------------------
           Restore Saved Answers
        ----------------------------------------- */

        if (attemptDetails.currentAnswers) {
          setAnswers(attemptDetails.currentAnswers);
        }

      } catch (err) {
        console.error("Failed to load review", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();

  }, [attemptId, navigate]);

  /* ============================================================
     LOADING STATE
  ============================================================ */

  if (loading) return <Loader />;

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* HEADER */}
      <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">
          Attempt Review
        </h1>

        <Link
          to={`/student/attempt/${attemptId}/result`}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          &larr; Back to Results
        </Link>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">

          {questions.map((q, idx) => (
            <QuestionReviewCard
              key={q.id}
              index={idx}
              question={q}
              selectedOptionId={answers[q.id]}
              correctOptionId={q.correctOptionId}
            />
          ))}

          {questions.length === 0 && (
            <p className="text-center text-gray-500">
              No questions found to review.
            </p>
          )}

        </div>
      </div>

    </div>
  );
};

export default AttemptReview;