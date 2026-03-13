/**
 * ================================================================
 * Attempt Service
 * ================================================================
 * Centralized API layer for all student attempt operations.
 *
 * Responsibilities:
 *  - Isolate HTTP calls
 *  - Keep UI components clean
 *  - Standardize API usage
 *  - Enable easier maintenance & scaling
 *
 * IMPORTANT:
 *  - No business logic here
 *  - Only API calls
 * ================================================================
 */

import api from '../../../../core/api/axios';

/* ================================================================
   ATTEMPT SESSION
================================================================ */

/**
 * Fetch Attempt Details
 */
export const getAttemptDetails = async (attemptId) => {
  const res = await api.get(`/student/attempts/${attemptId}/session`);
  return res.data.data;
};

/**
 * Fetch Attempt Questions
 */
export const getAttemptQuestions = async (attemptId) => {
  const res = await api.get(`/student/attempts/${attemptId}/questions`);
  return res.data.data;
};

/**
 * Save Answer (Background Sync)
 */
export const saveAnswer = async (
  attemptId,
  questionId,
  selectedOption,
  token
) => {
  return api.post(
    `/student/attempts/${attemptId}/answers`,
    {
      questionId,
      selectedOption
    },
    {
      headers: {
        "X-Attempt-Token": token
      }
    }
  );
};

/**
 * Submit Attempt
 */
export const submitAttempt = async (attemptId) => {
  return api.post(`/student/attempts/${attemptId}/submit`);
};


/* ================================================================
   HISTORY & RESULT
================================================================ */

/**
 * Fetch Attempt History
 */
export const getAttemptHistory = async () => {
  const res = await api.get('/student/attempts');
  return res.data.data;
};

/**
 * Fetch Attempt Result Summary
 */
export const getAttemptResult = async (attemptId) => {
  const res = await api.get(`/student/attempts/${attemptId}/result`);
  return res.data.data;
};

/**
 * Fetch Attempt Answers (Detailed Review)
 */
export const getAttemptAnswers = async (attemptId) => {
  const res = await api.get(`/student/attempts/${attemptId}/answers`);
  return res.data.data;
};

/**
 * Fetch Attempt Review Details (Security Check)
 */
export const getAttemptReviewDetails = async (attemptId) => {
  const res = await api.get(`/student/attempts/${attemptId}/details`);
  return res.data.data;
};
