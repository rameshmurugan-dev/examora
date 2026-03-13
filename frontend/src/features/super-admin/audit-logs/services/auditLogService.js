/**
 * Super Admin - Audit Log Service
 * Centralized API layer for fetching audit logs.
 */

import api from '../../../../core/api/axios';

/**
 * Fetch audit logs by number of days
 * @param {number} days - Number of past days to fetch logs for
 */
export const fetchAuditLogsApi = async (days) => {
  const response = await api.get(`/super-admin/audit-logs?days=${days}`);
  return response.data.data;
};