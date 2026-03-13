/**
 * ================================================================
 * Question Bank Service
 * ================================================================
 * Centralized API layer for Question Bank module.
 *
 * Responsibilities:
 *  - Handle all HTTP communication
 *  - Return clean response data
 *  - No UI logic here
 *  - No state handling here
 *
 * IMPORTANT:
 *  - Do NOT modify endpoint paths
 *  - Do NOT modify response structure
 * ================================================================
 */

import api from '../../../../core/api/axios';

/* =================================================================
   SECTION APIs
================================================================= */

/**
 * Fetch all sections
 * @returns {Promise<Array>}
 */
export const fetchSectionsAPI = async () => {
  const res = await api.get('/admin/question-bank/sections');
  return res.data.data;
};

/**
 * Create a new section
 * @param {Object} payload
 */
export const createSectionAPI = async (payload) => {
  return await api.post('/admin/question-bank/sections', payload);
};

/**
 * Update existing section
 * @param {number|string} sectionId
 * @param {Object} payload
 */
export const updateSectionAPI = async (sectionId, payload) => {
  return await api.put(
    `/admin/question-bank/sections/${sectionId}`,
    payload
  );
};

/**
 * Delete section
 * @param {number|string} sectionId
 */
export const deleteSectionAPI = async (sectionId) => {
  return await api.delete(
    `/admin/question-bank/sections/${sectionId}`
  );
};


/* =================================================================
   SUBSECTION APIs
================================================================= */

/**
 * Fetch subsections by section
 * @param {number|string} sectionId
 * @returns {Promise<Array>}
 */
export const fetchSubSectionsAPI = async (sectionId) => {
  const res = await api.get(
    `/admin/question-bank/sections/${sectionId}/subsections`
  );
  return res.data.data;
};

/**
 * Create subsection
 * @param {number|string} sectionId
 * @param {Object} payload
 */
export const createSubSectionAPI = async (sectionId, payload) => {
  return await api.post(
    `/admin/question-bank/sections/${sectionId}/subsections`,
    payload
  );
};

/**
 * Update subsection
 * @param {number|string} subSectionId
 * @param {Object} payload
 */
export const updateSubSectionAPI = async (subSectionId, payload) => {
  return await api.put(
    `/admin/question-bank/subsections/${subSectionId}`,
    payload
  );
};

/**
 * Delete subsection
 * @param {number|string} subSectionId
 */
export const deleteSubSectionAPI = async (subSectionId) => {
  return await api.delete(
    `/admin/question-bank/subsections/${subSectionId}`
  );
};


/* =================================================================
   QUESTION APIs
================================================================= */

/**
 * Fetch paginated questions for a subsection
 * @param {number|string} subSectionId
 * @param {number} page
 * @param {number} size
 * @returns {Promise<Object>} pageData
 */
export const fetchQuestionsAPI = async (
  subSectionId,
  page,
  size
) => {
  const res = await api.get(
    `/admin/question-bank/subsections/${subSectionId}/questions`,
    {
      params: { page, size }
    }
  );

  return res.data.data; // contains content + totalPages
};

/**
 * Create question
 * @param {number|string} subSectionId
 * @param {Object} payload
 */
export const createQuestionAPI = async (
  subSectionId,
  payload
) => {
  return await api.post(
    `/admin/question-bank/subsections/${subSectionId}/questions`,
    payload
  );
};

/**
 * Update question
 * @param {number|string} questionId
 * @param {Object} payload
 */
export const updateQuestionAPI = async (
  questionId,
  payload
) => {
  return await api.put(
    `/admin/question-bank/questions/${questionId}`,
    payload
  );
};

/**
 * Delete question
 * @param {number|string} questionId
 */
export const deleteQuestionAPI = async (questionId) => {
  return await api.delete(
    `/admin/question-bank/questions/${questionId}`
  );
};


/* =================================================================
   BULK UPLOAD API
================================================================= */

/**
 * Bulk upload questions via CSV
 * @param {number|string} subSectionId
 * @param {File} file
 * @returns {Promise<Object>} result summary
 */
export const bulkUploadQuestionsAPI = async (
  subSectionId,
  file
) => {

  const form = new FormData();
  form.append('file', file);

  const res = await api.post(
    `/admin/question-bank/subsections/${subSectionId}/questions/bulk-upload`,
    form,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return res.data.data;
};