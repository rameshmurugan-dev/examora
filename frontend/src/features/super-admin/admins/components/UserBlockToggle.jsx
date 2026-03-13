import { useState } from 'react';
import { blockUserApi, unblockUserApi } from '../services/adminManagementService';

/**
 * Toggle block/unblock state for user.
 */
const UserBlockToggle = ({ user, onChange }) => {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setLoading(true);

    try {
      if (value === 'BLOCKED') {
        await blockUserApi(user.id);
      } else {
        await unblockUserApi(user.id);
      }

      onChange();
    } catch (err) {
      console.error('Block/Unblock failed', err);
      alert('Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={user.blocked ? 'BLOCKED' : 'UNBLOCKED'}
      onChange={handleChange}
      disabled={loading}
      className={`
        px-2.5 py-1 text-sm font-semibold rounded-full
        border cursor-pointer appearance-none text-center
        ${user.blocked
          ? 'bg-red-100 text-red-700 border-red-200'
          : 'bg-green-100 text-green-700 border-green-200'}
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        focus:outline-none
      `}
    >
      <option value="UNBLOCKED">Unblocked</option>
      <option value="BLOCKED">Blocked</option>
    </select>
  );
};

export default UserBlockToggle;