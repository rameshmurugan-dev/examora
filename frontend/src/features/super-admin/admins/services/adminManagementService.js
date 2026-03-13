/**
 * Super Admin - Admin Management Service
 * Centralized API layer for admin operations.
 * Keeps components clean and production-ready.
 */

import api from '../../../../core/api/axios';

/**
 * Fetch all admin users
 */
export const fetchAdminsApi = async () => {
  const response = await api.get('/super-admin/admins');
  return response.data.data; // FIXED
};

/**
 * Create new admin
 */
export const createAdminApi = async (payload) => {
  const response = await api.post('/super-admin/admin', payload);
  return response.data.data;
};

/**
 * Update admin details
 */
export const updateAdminApi = async (adminId, payload) => {
  const response = await api.put(`/super-admin/${adminId}`, payload);
  return response.data.data;
};

/**
 * Delete user
 */
export const deleteUserApi = async (userId) => {
  const response = await api.delete(`/super-admin/users/${userId}`);
  return response.data.data;
};

/**
 * Block user
 */
export const blockUserApi = async (userId) => {
  const response = await api.patch(`/super-admin/users/${userId}/block`);
  return response.data.data;
};

/**
 * Unblock user
 */
export const unblockUserApi = async (userId) => {
  const response = await api.patch(`/super-admin/users/${userId}/unblock`);
  return response.data.data;
};