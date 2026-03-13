import { useState } from 'react';
import { deleteUserApi } from '../services/adminManagementService';

/**
 * Confirmation modal for deleting user.
 */
const DeleteUserModal = ({ user, onClose, onSuccess }) => {

  const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteUserApi(user.id);
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg w-96 p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-4">
          Delete {user.role === 'ADMIN' ? 'Admin' : 'Student'}
        </h2>

        <p>
          Are you sure you want to delete <b>{user.name}</b>?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            onClick={confirmDelete}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
              }`}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;