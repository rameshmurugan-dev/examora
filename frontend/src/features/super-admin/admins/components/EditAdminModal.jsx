import { useState } from 'react';
import { updateAdminApi } from '../services/adminManagementService';

/**
 * Modal for editing admin details.
 */
const EditAdminModal = ({ admin, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: admin.name,
    email: admin.email,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    setLoading(true);
    try {
      await updateAdminApi(admin.id, form);
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        <div className="bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200 px-6 py-4">
          <h2 className="text-gray-800 text-lg font-semibold">
            Edit Admin
          </h2>
          <p className="text-gray-600 text-sm">
            Update administrator account details
          </p>
        </div>

        <div className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Changing email affects login credentials
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white font-medium transition cursor-pointer ${loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAdminModal;