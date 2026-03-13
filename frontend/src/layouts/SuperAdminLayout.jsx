/**
 * Super Admin Layout
 * Wrapper layout for all Super Admin routes.
 * Handles sidebar toggle, logout flow, and route rendering.
 */

import { useState, useCallback, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../core/context/AuthContext';
import TopBar from '../shared/layout/TopBar';
import Sidebar from '../shared/layout/Sidebar';

import {
  LayoutDashboard,
  Users,
  FileSearch,
  Info,
} from 'lucide-react';

/**
 * Super Admin sidebar menu configuration
 */
const SUPER_ADMIN_MENU = [
  {
    to: '/super-admin/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    to: '/super-admin/admins',
    label: 'Manage Admins',
    icon: <Users size={18} />,
  },
  {
    to: '/super-admin/students',
    label: 'Manage Students',
    icon: <Users size={18} />,
  },
  {
    to: '/super-admin/audit-logs',
    label: 'Audit Logs',
    icon: <FileSearch size={18} />,
  },
];

const SuperAdminLayout = () => {
  const [open, setOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Toggle sidebar state
   */
  const toggleSidebar = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  /**
   * Handle logout with navigation redirect
   */
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  /**
   * Memoized menu items
   */
  const menuItems = useMemo(() => SUPER_ADMIN_MENU, []);

  return (
    <>
      {/* Top Navigation */}
      <TopBar
        title="Super Admin Console"
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

export default SuperAdminLayout;