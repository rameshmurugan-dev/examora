import { useState } from 'react';
import { inviteStudentApi } from '../services/studentManagementService';

/**
 * Invite Student Modal
 */
const InviteStudentModal = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) {
      alert('Email is required');
      return;
    }

    setLoading(true);
    try {
      await inviteStudentApi(email);
      alert('Invite sent successfully');
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to invite student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg overflow-hidden">

        <div className="bg-indigo-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Invite Student
          </h2>
          <p className="text-sm text-gray-600">
            Student will receive an activation link
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Email
            </label>
            <input
              type="email"
              required
              placeholder="student@example.com"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-600 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
          >
            {loading ? 'Inviting…' : 'Send Invite'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default InviteStudentModal;