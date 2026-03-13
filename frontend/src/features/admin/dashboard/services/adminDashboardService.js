/**
 * dashboardService
 * ----------------------------------------------------
 * Centralized API layer for Admin Dashboard.
 * Handles:
 * - Exams list
 * - Analytics summary
 */

import api from '../../../../core/api/axios';

const adminDashboardService = {
    /**
     * Fetch all exams created by admin
     */
    async getAllExams() {
        const { data } = await api.get('/admin/exams');
        return data?.data ?? [];
    },

    /**
     * Fetch analytics summary for exams
     */
    async getExamAnalytics() {
        const { data } = await api.get('/admin/analytics/exams');
        return data.data ?? [];
    }
};

export default adminDashboardService;