/**
 * Super Admin - Admin Management Page
 * Handles admin CRUD operations with pagination.
 */

import { useState, useEffect, useCallback } from 'react';
import Loader from '../../../../shared/components/Loader';
import AdminStatusBadge from '../components/AdminStatusBadge';
import CreateAdminModal from '../components/CreateAdminModal';
import DeleteUserModal from '../components/DeleteUserModal';
import EditAdminModal from '../components/EditAdminModal';
import UserBlockToggle from '../components/UserBlockToggle';
import { fetchAdminsApi } from '../services/adminManagementService';

const PAGE_SIZE = 10;

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(admins.length / PAGE_SIZE);

  const paginatedAdmins = (admins || []).slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  /**
   * Fetch all admins from backend
   */
  const fetchAdmins = useCallback(async () => {
    try {
      const data = await fetchAdminsApi();
      setAdmins(data);
    } catch (err) {
      console.error('Failed to fetch admins', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {admins.length} admin account{admins.length !== 1 && 's'} registered
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm cursor-pointer"
        >
          + Create Admin
        </button>
      </div>

      {admins.length === 0 && (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
          No admins found. Create your first admin to get started.
        </div>
      )}

      {admins.length > 0 && (
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
              {paginatedAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className={`border-b last:border-b-0 ${admin.blocked ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{admin.name}</td>
                  <td className="px-6 py-4 text-gray-600">{admin.email}</td>

                  <td className="px-6 py-4 text-center">
                    <AdminStatusBadge status={admin.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <UserBlockToggle user={admin} onChange={fetchAdmins} />
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => setEditTarget(admin)}
                        disabled={admin.blocked}
                        className={`text-sm font-medium ${admin.blocked
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-indigo-600 hover:text-indigo-800'
                          }`}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteTarget(admin)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border text-sm ${page === currentPage
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white hover:bg-gray-100'
                }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateAdminModal
          onClose={() => setShowCreate(false)}
          onSuccess={fetchAdmins}
        />
      )}

      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchAdmins}
        />
      )}

      {editTarget && (
        <EditAdminModal
          admin={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchAdmins}
        />
      )}
    </div>
  );
};

export default AdminManagement;