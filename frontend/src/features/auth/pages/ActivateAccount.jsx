import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../../core/api/axios';

const ActivateAccount = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  const [email, setEmail] = useState('');
  const [form, setForm] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid activation link');
      setLoading(false);
      return;
    }

    api
      .get('/auth/invite/validate', { params: { token } })
      .then((res) => setEmail(res.data.data))
      .catch(() => setError('Invite link is invalid or expired'))
      .finally(() => setLoading(false));
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/invite/activate', {
        token,
        name: form.name,
        password: form.password,
      });

      alert('Account activated successfully.');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Activation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-indigo-600 animate-pulse">
        Validating invite…
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Activate Your Account
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Complete your registration
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="
          mb-5 text-sm text-red-600
          bg-red-50 border border-red-100
          px-4 py-2.5 rounded-xl
        ">
          {error}
        </div>
      )}

      {/* Form */}
      <form className="space-y-5" onSubmit={submit}>
        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            value={email}
            disabled
            className="
              w-full mt-1.5 px-4 py-3
              border border-gray-200 rounded-xl
              bg-gray-100 text-gray-500
              cursor-not-allowed
            "
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            required
            placeholder="Enter your full name"
            className="
              w-full mt-1.5 px-4 py-3
              border border-gray-200 rounded-xl
              bg-gray-50/60
              focus:bg-white focus:ring-2 focus:ring-indigo-500
              outline-none transition
            "
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="Create a password"
            className="
              w-full mt-1.5 px-4 py-3
              border border-gray-200 rounded-xl
              bg-gray-50/60
              focus:bg-white focus:ring-2 focus:ring-indigo-500
              outline-none transition
            "
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            required
            placeholder="Confirm your password"
            className="
              w-full mt-1.5 px-4 py-3
              border border-gray-200 rounded-xl
              bg-gray-50/60
              focus:bg-white focus:ring-2 focus:ring-indigo-500
              outline-none transition
            "
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`
            w-full py-3 rounded-xl
            text-white font-semibold
            shadow-md transition-all
            ${submitting
              ? 'bg-indigo-400'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}
          `}
        >
          {submitting ? 'Activating…' : 'Activate Account'}
        </button>
      </form>
    </>
  );
};

export default ActivateAccount;
