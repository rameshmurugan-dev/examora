/**
 * Admin Layout
 * Wrapper layout for all Admin routes.
 * Handles sidebar toggle, logout, and route outlet rendering.
 */

import { useState, useCallback, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../core/context/AuthContext';
import TopBar from '../shared/layout/TopBar';
import Sidebar from '../shared/layout/Sidebar';

import {
  LayoutDashboard,
  BookOpen,
  BarChart,
  Info,
  ClipboardList,
} from 'lucide-react';

/**
 * Admin sidebar menu configuration
 * Memoized for stability and scalability.
 */
const ADMIN_MENU = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    to: '/admin/question-bank',
    label: 'Question Bank',
    icon: <BookOpen size={18} />,
  },
  {
    to: '/admin/exams',
    label: 'Exam Builder',
    icon: <BookOpen size={18} />,
  },
  {
    to: '/admin/my-exams',
    label: 'My Exams',
    icon: <ClipboardList size={18} />,
  },
  {
    to: '/admin/analytics',
    label: 'Analytics',
    icon: <BarChart size={18} />,
  },
];

const AdminLayout = () => {
  const [open, setOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles user logout
   */
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  /**
   * Toggle sidebar open/close
   */
  const toggleSidebar = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  /**
   * Sidebar items (memoized for safety)
   */
  const menuItems = useMemo(() => ADMIN_MENU, []);

  return (
    <>
      {/* Top Navigation Bar */}
      <TopBar
        title="Admin Portal"
        onMenuClick={toggleSidebar}
      />

      {/* Sidebar */}
      <Sidebar
        open={open}
        items={menuItems}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main
        className={`
          pt-16
          ${open ? 'pl-60' : 'pl-0'}
          transition-all
        `}
      >
        <div className="p-6 min-h-screen bg-indigo-100">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AdminLayout;