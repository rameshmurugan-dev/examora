/**
 * Student Layout
 * Wrapper layout for all Student routes.
 * Handles sidebar toggle and route rendering.
 */

import { useState, useCallback, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../core/context/AuthContext';
import TopBar from '../shared/layout/TopBar';
import Sidebar from '../shared/layout/Sidebar';

import {
  LayoutDashboard,
  BookOpen,
  History,
  Info,
} from 'lucide-react';

/**
 * Student sidebar menu configuration
 */
const STUDENT_MENU = [
  {
    to: '/student/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    to: '/student/exams',
    label: 'Exams',
    icon: <BookOpen size={18} />,
  },
  {
    to: '/student/history',
    label: 'Attempt History',
    icon: <History size={18} />,
  },
];

const StudentLayout = () => {
  const [open, setOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Toggle sidebar open/close
   */
  const toggleSidebar = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  /**
   * Handle logout with navigation safety
   */
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  /**
   * Memoized menu items (stability optimization)
   */
  const menuItems = useMemo(() => STUDENT_MENU, []);

  return (
    <>
      {/* Top Navigation */}
      <TopBar
        title="Student Dashboard"
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

export default StudentLayout;