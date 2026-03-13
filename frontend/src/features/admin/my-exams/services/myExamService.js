/**
 * Admin - My Exams Service
 * ----------------------------------------
 * Handles all API communication related to
 * admin exam management.
 *
 * Rules:
 * - Only responsible for API calls
 * - No UI logic here
 */

import api from '../../../../core/api/axios';

/**
 * Fetch all exams created by admin
 * @returns {Promise<Array>} List of exams
 */
export const fetchAdminExams = async () => {
    const response = await api.get('/admin/exams');
    return response.data?.data || [];
};

/**
 * Publish a draft exam
 * @param {string|number} examId
 */
export const publishExam = async (examId) => {
    return await api.post(`/admin/exams/${examId}/publish`);
};

/**
 * Close a published exam
 * @param {string|number} examId
 */
export const closeExam = async (examId) => {
    return await api.post(`/admin/exams/${examId}/close`);
};

/**
 * Delete a draft exam
 * @param {string|number} examId
 */
export const deleteExam = async (examId) => {
    return await api.delete(`/admin/exams/${examId}`);
};