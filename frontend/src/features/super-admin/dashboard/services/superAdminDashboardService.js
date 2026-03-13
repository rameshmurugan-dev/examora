/**
 * Super Admin - Dashboard Service
 * Handles system overview statistics API calls.
 */

import api from '../../../../core/api/axios';

/**
 * Fetch system-wide dashboard summary stats
 */
export const fetchDashboardSummaryApi = async () => {
  const response = await api.get('/super-admin/dashboard/summary');
  return response.data.data;
};

/**
 * Fetch recent audit logs
 */
export const fetchRecentAuditLogsApi = async () => {
  const response = await api.get('/super-admin/audit-logs?days=1');
  return response.data.data;
};