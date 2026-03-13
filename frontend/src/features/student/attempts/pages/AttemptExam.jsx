/**
 * ================================================================
 * AttemptExam
 * ================================================================
 * Active exam session page.
 *
 * Responsibilities:
 *  - Load attempt + questions
 *  - Manage navigation between questions
 *  - Persist answers (local + backend sync)
 *  - Handle submission (manual + auto)
 *  - Manage timer expiration
 * ================================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useExamTimer from '../utils/useExamTimer';
import {
  saveAnswerLocal,
  getLocalAnswers,
  clearLocalAnswers
} from '../utils/examPersistence';

import {
  getAttemptDetails,
  getAttemptQuestions,
  saveAnswer,
  submitAttempt
} from '../services/attemptService';

import ExamHeader from '../../../student/attempts/components/ExamHeader';
import QuestionRenderer from '../../../student/attempts/components/QuestionRenderer';
import AnswerNavigator from '../../../student/attempts/components/AnswerNavigator';
import SubmitConfirmModal from '../../../student/attempts/components/SubmitConfirmModal';
import Loader from '../../../../shared/components/Loader';

const AttemptExam = () => {

  /* ============================================================
     ROUTER
  ============================================================ */

  const { attemptId } = useParams();
  const navigate = useNavigate();

  /* ============================================================
     DATA STATE
  ============================================================ */

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);

  /* ============================================================
     EXAM STATE
  ============================================================ */

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  /* ============================================================
     TIMER
  ============================================================ */

  const { secondsRemaining } =
    useExamTimer(attempt?.expiresAt, () => handleSubmitExam(true));

  /* ============================================================
     DEBOUNCE REF
  ============================================================ */

  const saveTimeoutRef = useRef(null);

  /* ============================================================
     INITIAL LOAD
  ============================================================ */

  useEffect(() => {
    fetchExamData();
  }, [attemptId]);

  // Prevent multiple tabs
  useEffect(() => {
    const existing = localStorage.getItem("exam-active");

    if (existing) {
      alert("Exam already opened in another tab.");
      window.location.href = "/student/dashboard";
      return;
    }

    localStorage.setItem("exam-active", "true");

    return () => {
      localStorage.removeItem("exam-active");
    };
  }, []);

  // Disable copy paste
  useEffect(() => {
    const disable = (e) => e.preventDefault();

    document.addEventListener("copy", disable);
    document.addEventListener("paste", disable);
    document.addEventListener("contextmenu", disable);

    return () => {
      document.removeEventListener("copy", disable);
      document.removeEventListener("paste", disable);
      document.removeEventListener("contextmenu", disable);
    };
  }, []);

  // Prevent page refresh
  useEffect(() => {
    const handleRefresh = (e) => {
      e.preventDefault();
      e.returnValue = "Refreshing will end the exam!";
    };

    window.addEventListener("beforeunload", handleRefresh);

    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, []);


  const fetchExamData = async () => {
    try {
      // Parallel fetch
      const [attemptData, questionsData] = await Promise.all([
        getAttemptDetails(attemptId),
        getAttemptQuestions(attemptId)
      ]);

      setAttempt(attemptData);

      // Safety: If already submitted → redirect
      if (attemptData.status === 'SUBMITTED') {
        navigate(`/student/attempt/${attemptId}/result`, { replace: true });
        return;
      }

      setQuestions(questionsData);

      /* -----------------------------------------
         Restore Answers
         Backend + Local Merge
      ----------------------------------------- */

      const backendAnswers = {};

      questionsData.forEach(q => {
        if (q.savedOption) {
          backendAnswers[q.questionId] = q.savedOption;
        }
      });

      const localAnswers = getLocalAnswers(attemptId);

      setAnswers({
        ...backendAnswers,
        ...localAnswers
      });

    } catch (err) {
      alert("Failed to load exam. Please refresh or contact support.");
      navigate('/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     ANSWER HANDLING
  ============================================================ */

  const handleAnswerChange = useCallback((newAnswer) => {

    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    // Optimistic UI update
    setAnswers(prev => ({
      ...prev,
      [currentQ.questionId]: newAnswer
    }));

    // Persist locally
    saveAnswerLocal(attemptId, currentQ.questionId, newAnswer);

    // Debounced backend sync
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveAnswer(
          attemptId,
          currentQ.questionId,
          newAnswer,
          attempt.sessionToken
        );
      } catch {
        // Silent fail (local storage fallback)
      }
    }, 1000);

  }, [questions, currentQuestionIndex, attemptId]);

  /* ============================================================
     SUBMISSION
  ============================================================ */

  const handleSubmitExam = async (auto = false) => {

    if (isSubmitting) return;

    setIsSubmitting(true);
    setShowSubmitModal(false);

    try {
      await submitAttempt(attemptId);

      clearLocalAnswers(attemptId);

      navigate(`/student/attempt/${attemptId}/result`);

    } catch {
      if (auto) {
        alert("Time expired but submission failed. Please try submitting manually.");
      } else {
        alert("Failed to submit exam. Please check your connection and try again.");
      }

      setIsSubmitting(false);
    }
  };

  /* ============================================================
     LOADING STATE
  ============================================================ */

  if (loading) return <Loader />;

  if (!attempt || !questions.length) {
    return (
      <div className="p-10 text-center">
        Exam not found or unavailable.
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* HEADER */}
      <ExamHeader
        examTitle={attempt.examTitle}
        studentName={attempt.studentName}
        secondsRemaining={secondsRemaining}
      />

      <main className="flex-1 flex overflow-hidden">

        {/* LEFT: QUESTION AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-3xl mx-auto">

            <div className="mb-4 flex justify-between items-center bg-white p-4 rounded shadow-sm border">
              <h2 className="text-lg font-bold text-gray-700">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <span className="text-sm text-gray-500">
                {currentQ?.questionType?.replace('_', ' ')}
              </span>
            </div>

            <QuestionRenderer
              question={currentQ}
              savedAnswer={answers[currentQ?.questionId] || ''}
              onAnswerChange={handleAnswerChange}
            />

            <div className="mt-8 flex justify-between">

              <button
                onClick={() =>
                  setCurrentQuestionIndex(curr => Math.max(0, curr - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(curr => curr + 1)
                  }
                  className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
                >
                  Finish Exam
                </button>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT: NAVIGATOR */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto hidden lg:block p-4">

          <AnswerNavigator
            totalQuestions={questions.length}
            currentQuestionIndex={currentQuestionIndex}
            savedAnswers={Object.keys(answers).reduce((acc, qId) => {
              const idx = questions.findIndex(
                q => q.questionId === parseInt(qId)
              );
              if (idx !== -1) acc[idx] = true;
              return acc;
            }, {})}
            onNavigate={setCurrentQuestionIndex}
          />

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-md font-medium hover:bg-red-100"
            >
              Submit Exam
            </button>
          </div>

        </div>
      </main>

      {/* SUBMIT MODAL */}
      <SubmitConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={() => handleSubmitExam(false)}
        summary={{
          total: questions.length,
          answered: Object.keys(answers).length
        }}
      />

      {/* SUBMISSION OVERLAY */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader />
            <p className="mt-4 text-gray-600 font-medium">
              Submitting your exam...
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default AttemptExam;