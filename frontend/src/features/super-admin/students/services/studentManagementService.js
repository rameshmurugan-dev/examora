/**
 * Super Admin - Student Management Service
 * Centralized API layer for all student operations.
 */

import api from '../../../../core/api/axios';

/**
 * Fetch all students
 */
export const fetchStudentsApi = async () => {
  const response = await api.get('/super-admin/users/students');
  return response.data.data;
};

/**
 * Invite a single student
 */
export const inviteStudentApi = async (email) => {
  const response = await api.post('/super-admin/students/invite', { email });
  return response.data;
};

/**
 * Resend invitation email
 */
export const resendStudentInviteApi = async (email) => {
  const response = await api.post('/super-admin/students/invite/resend', { email });
  return response.data;
};

/**
 * Bulk upload students via CSV
 */
export const bulkUploadStudentsApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(
    '/super-admin/students/bulk-upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};