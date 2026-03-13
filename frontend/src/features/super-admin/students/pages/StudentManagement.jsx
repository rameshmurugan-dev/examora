/**
 * Super Admin: Student Management
 * Invite, bulk upload, block/unblock students.
 */

import { useEffect, useState, useCallback } from 'react';
import Loader from '../../../../shared/components/Loader';
import AdminStatusBadge from '../../admins/components/AdminStatusBadge';
import UserBlockToggle from '../../admins/components/UserBlockToggle';
import InviteStudentModal from '../components/InviteStudentModal';
import DeleteUserModal from '../../admins/components/DeleteUserModal';
import BulkStudentUploadModal from '../components/BulkStudentUploadModal';
import {
  fetchStudentsApi,
  resendStudentInviteApi,
} from '../services/studentManagementService';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const fetchStudents = useCallback(async () => {
    try {
      const data = await fetchStudentsApi();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const resendInvite = async (student) => {
    const key = `resend-${student.id}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await resendStudentInviteApi(student.email);
      await fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resend invite');
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Student Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {students.length} student{students.length !== 1 && 's'} registered
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowInvite(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm cursor-pointer"
          >
            + Invite Student
          </button>

          <button
            onClick={() => setShowBulkUpload(true)}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 border cursor-pointer"
          >
            Bulk Upload
          </button>
        </div>
      </div>

      {students.length === 0 && (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
          No students found.
        </div>
      )}

      {students.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Block</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className={`border-b last:border-b-0 ${student.blocked ? 'bg-red-50' : 'hover:bg-gray-50'
                    }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {student.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {student.email}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <AdminStatusBadge status={student.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <UserBlockToggle user={student} onChange={fetchStudents} />
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => setDeleteTarget(student)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>

                      {student.status === 'INVITED' && (
                        <button
                          onClick={() => resendInvite(student)}
                          disabled={actionLoading[`resend-${student.id}`]}
                          className={`text-sm font-medium ${actionLoading[`resend-${student.id}`]
                              ? 'text-indigo-400 cursor-not-allowed'
                              : 'text-indigo-600 hover:text-indigo-800'
                            }`}
                        >
                          {actionLoading[`resend-${student.id}`] ? 'Resending...' : 'Resend Invite'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showInvite && (
        <InviteStudentModal
          onClose={() => setShowInvite(false)}
          onSuccess={fetchStudents}
        />
      )}

      {showBulkUpload && (
        <BulkStudentUploadModal
          onClose={() => setShowBulkUpload(false)}
          onSuccess={fetchStudents}
        />
      )}

      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchStudents}
        />
      )}
    </div>
  );
};

export default StudentManagement;