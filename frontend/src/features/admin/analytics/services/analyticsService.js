/**
 * analyticsService
 * ----------------------------------------------------
 * Centralized API layer for Admin Analytics module.
 * Keeps components clean and maintainable.
 */

import api from '../../../../core/api/axios';

const analyticsService = {
    /**
     * Fetch all exams created by admin
     */
    async getAllExams() {
        const { data } = await api.get('/admin/analytics/exams');
        return data.data;
    },

    /**
     * Fetch overall exam statistics
     */
    async getExamStats(examId) {
        const { data } = await api.get(`/admin/analytics/exams/${examId}`);
        return data.data;
    },

    /**
     * Fetch section-level performance
     */
    async getSectionStats(examId) {
        const { data } = await api.get(`/admin/analytics/exams/${examId}/sections`);
        return data.data;
    },

    /**
     * Fetch question-level performance
     */
    async getQuestionStats(examId) {
        const { data } = await api.get(`/admin/analytics/exams/${examId}/questions`);
        return data.data;
    }
};

export default analyticsService;