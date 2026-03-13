import api from '../../../../core/api/axios';

/**
 * Exam Builder Service
 * Centralizes all admin exam builder API calls
 */

// ---------------- EXAM ----------------

export const createExam = (examData) =>
  api.post('/admin/exams', examData);

export const publishExam = (examId) =>
  api.post(`/admin/exams/${examId}/publish`);

export const fetchExamStructure = (examId) =>
  api.get(`/admin/exams/${examId}/structure`);

export const fetchAllExams = () =>
  api.get('/admin/exams');

// ---------------- SECTIONS ----------------

export const fetchBankSections = () =>
  api.get('/admin/question-bank/sections');

export const attachSection = (examId, sectionId) =>
  api.post(`/admin/exams/${examId}/sections/${sectionId}`);

export const detachSection = (examId, sectionId) =>
  api.delete(`/admin/exams/${examId}/sections/${sectionId}`);

// ---------------- SUBSECTIONS ----------------

export const fetchBankSubSections = (sectionId) =>
  api.get(`/admin/question-bank/sections/${sectionId}/subsections`);

export const attachSubSection = (examId, sectionId, subSectionId) =>
  api.post(`/admin/exams/${examId}/sections/${sectionId}/subsections/${subSectionId}`);

export const detachSubSection = (examId, examSubSectionId) =>
  api.delete(`/admin/exams/${examId}/subsections/${examSubSectionId}`);

export const fetchExamSubSection = (examSubSectionId) =>
  api.get(`/admin/exams/subsections/${examSubSectionId}`);

export const updateSubSectionSettings = (examSubSectionId, payload) =>
  api.put(`/admin/exams/subsections/${examSubSectionId}/settings`, payload);

export const generateQuestions = (examSubSectionId) =>
  api.post(`/admin/exams/subsections/${examSubSectionId}/generate`);

// ---------------- QUESTIONS ----------------

export const fetchQuestionsBySubSection = (examSubSectionId) =>
  api.get(`/admin/exams/questions/by-subsection/${examSubSectionId}`, {
    params: { page: 0, size: 100 },
  });

export const toggleQuestionRemoval = (questionId, removed) =>
  api.patch(`/admin/exams/questions/${questionId}`, { removed });

export const updateExamQuestion = (examId, questionId, payload) =>
  api.put(`/admin/exams/${examId}/questions/${questionId}`, payload);

export const fetchBankQuestions = (subSectionId) =>
  api.get(`/admin/question-bank/subsections/${subSectionId}/questions`, {
    params: { page: 0, size: 50 },
  });

export const addQuestionFromBank = (examId, originalQuestionId) =>
  api.post(`/admin/exams/${examId}/questions/add-from-bank`, null, {
    params: { originalQuestionId },
  });