// src/pages/auth/Login.jsx


import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Invalid credentials. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      switch (user.role) {
        case 'SUPER_ADMIN':
          navigate('/super-admin/dashboard', { replace: true });
          break;
        case 'ADMIN':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'STUDENT':
          navigate('/student/dashboard', { replace: true });
          break;
        default:
          navigate('/unauthorized', { replace: true });
      }
    }
  }, [user, navigate, from]);

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Sign in to continue
        </p>
      </div>

      {error && (
        <div className="mb-5 text-sm text-red-600
                      bg-red-50 border border-red-100
                      px-4 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="
            w-full mt-1.5 px-4 py-3
            border border-gray-200 rounded-xl
            bg-gray-50/60
            focus:bg-white focus:ring-2 focus:ring-indigo-500
            outline-none transition
          "
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="
            w-full mt-1.5 px-4 py-3
            border border-gray-200 rounded-xl
            bg-gray-50/60
            focus:bg-white focus:ring-2 focus:ring-indigo-500
            outline-none transition
          "
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`
          w-full py-3 rounded-xl
          text-white font-semibold
          shadow-md transition-all
          ${isSubmitting
              ? 'bg-indigo-400'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}
        `}
        >
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </>
  );
};

export default Login;
