/**
 * ================================================================
 * studentDashboardService
 * ================================================================
 * Service layer for Student Dashboard API calls.
 * ================================================================
 */

import api from '../../../../core/api/axios';

/**
 * Fetch dashboard aggregated data
 * Expected response structure:
 * {
 *   stats: {...},
 *   recentExams: [],
 *   recentAttempts: []
 * }
 */
export const fetchStudentDashboard = async () => {
    const response = await api.get('/student/dashboard');
    return response.data.data;
};