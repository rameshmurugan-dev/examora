import { Menu, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import logo from '../../assets/logo.png';

const TopBar = ({ title, onMenuClick }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const path = window.location.pathname;
  let basePath = '';

  if (path.startsWith('/super-admin')) basePath = '/super-admin';
  else if (path.startsWith('/admin')) basePath = '/admin';
  else if (path.startsWith('/student')) basePath = '/student';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header
      className="
      fixed top-0 left-0 z-50
      h-16 w-full
      flex items-center justify-between
      px-6
      bg-white
      border-b border-gray-200
      shadow-sm
    "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="
            p-2
            rounded-lg
            hover:bg-gray-100
            transition
          "
        >
          <Menu size={22} className="text-gray-700" />
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center"
        >
          <img
            src={logo}
            alt="Examora Logo"
            className="h-10 w-auto"
            loading="lazy"
          />
        </button>
      </div>

      {/* CENTER */}
      <div className="hidden md:flex flex-col text-center">
        <span className="text-xs font-medium text-gray-500">
          Welcome Back
        </span>

        <span className="text-lg font-semibold tracking-wide text-gray-800">
          {title}
        </span>
      </div>

      {/* RIGHT - USER MENU */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="
            w-9 h-9
            rounded-full
            bg-gray-100
            flex items-center justify-center
            hover:bg-gray-200
            transition
          "
        >
          <User size={18} className="text-gray-700" />
        </button>

        {open && (
          <div
            className="
              absolute right-0 mt-3
              w-48
              bg-white
              rounded-xl
              shadow-lg
              border border-gray-200
              py-2
              animate-fadeIn
            "
          >
            <button
              onClick={() => navigate(`${basePath}/profile`)}
              className="
                flex items-center gap-3
                w-full px-4 py-2
                text-sm
                text-gray-700
                hover:bg-gray-100
                transition
              "
            >
              <User size={16} />
              Profile
            </button>

            <div className="border-t my-1" />

            <button
              onClick={() => navigate('/login')}
              className="
                flex items-center gap-3
                w-full px-4 py-2
                text-sm
                text-red-600
                hover:bg-red-50
                transition
              "
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;