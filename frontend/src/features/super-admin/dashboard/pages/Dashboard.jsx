import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loader from '../../../../shared/components/Loader';
import { fetchDashboardSummaryApi } from '../services/superAdminDashboardService';
import { fetchRecentAuditLogsApi } from '../services/superAdminDashboardService';

const Dashboard = () => {

  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load dashboard data
   */
  useEffect(() => {

    const loadDashboard = async () => {
      try {

        const [statsData, logsData] = await Promise.all([
          fetchDashboardSummaryApi(),
          fetchRecentAuditLogsApi()
        ]);

        setStats(statsData);
        setAuditLogs(logsData.slice(0, 5)); // latest 5 logs

      } catch (err) {
        console.error('Dashboard load failed', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();

  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        System Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard title="Total Users" value={stats?.totalUsers} color="indigo" />
        <StatCard title="Total Admins" value={stats?.totalAdmins} color="green" />
        <StatCard title="Total Students" value={stats?.totalStudents} color="blue" />
        <StatCard title="Total Exams" value={stats?.totalExams} color="purple" />

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">

            <button
              onClick={() => navigate('/super-admin/admins')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
            >
              Create Admin
            </button>

            <button
              onClick={() => navigate('/super-admin/students')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
            >
              Invite Student
            </button>

            <button
              onClick={() => navigate('/super-admin/audit-logs')}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-md"
            >
              View Audit Logs
            </button>

          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent System Activity
          </h2>

          <div className="space-y-3">

            {auditLogs.length === 0 && (
              <p className="text-gray-500 text-sm">
                No recent activity
              </p>
            )}

            {auditLogs.map(log => (
              <div key={log.id} className="border-b pb-2">

                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{log.actorName}</span> ({log.actorRole})
                </p>

                <p className="text-xs text-gray-500">
                  {log.action} — {log.description}
                </p>

              </div>
            ))}

          </div>
        </div>

      </div>

    </div>
  );
};


/**
 * Stat Card Component
 */
const StatCard = ({ title, value, color }) => {

  const colors = {
    indigo: "text-indigo-600",
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">

      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
        {title}
      </h3>

      <p className={`mt-2 text-3xl font-bold ${colors[color]}`}>
        {value || 0}
      </p>

    </div>
  );
};

export default Dashboard;