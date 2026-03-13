/**
 * Auth Layout
 * Wrapper layout for authentication pages (Login, Register, Forgot Password).
 * Provides centered glass card UI with branded background.
 */

import { Outlet } from 'react-router-dom';
import logo from '../assets/icon.png';

const AuthLayout = () => {
  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        px-4
        bg-gradient-to-br
        from-indigo-500
        via-white
        to-purple-500
      "
    >
      <div className="relative z-10 w-full max-w-md perspective">

        {/* Soft Glow Background */}
        <div
          className="
            absolute inset-0
            bg-indigo-200/30
            blur-3xl
            rounded-full
          "
        />

        {/* Glass Card Container */}
        <div
          className="
            relative
            bg-white/70 dark:bg-gray-900/70
            backdrop-blur-xl
            border border-white/40 dark:border-white/10
            shadow-2xl
            rounded-2xl
            p-8
            glass-shine
            animate-glow
          "
        >

          {/* Brand Logo */}
          <div className="text-center mb-6">
            <img
              src={logo}
              alt="Examora Logo"
              className="w-36 mx-auto logo-glow"
              loading="lazy"
            />
          </div>

          {/* Auth Page Content */}
          <Outlet />

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;