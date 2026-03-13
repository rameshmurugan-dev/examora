/**
 * Super Admin - Audit Logs Page
 * Displays system-wide chronological activity logs.
 */

import { useState, useEffect, useMemo } from 'react';
import Loader from '../../../../shared/components/Loader';
import AuditLogRow from '../components/AuditLogRow';
import { fetchAuditLogsApi } from '../services/auditLogService';

const TABS = [
  { key: 'ALL', label: 'All Logs' },
  { key: 'ROLE_SUPER_ADMIN', label: 'Super Admin' },
  { key: 'ROLE_ADMIN', label: 'Admins' },
  { key: 'ROLE_STUDENT', label: 'Students' },
];

const PAGE_SIZE = 10;

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [days, setDays] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Fetch logs from backend
   */
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogsApi(days);
      setLogs(data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [days]);

  /**
   * Filter logs by selected role tab
   */
  const filteredLogs = useMemo(() => {
    if (activeTab === 'ALL') return logs;
    return logs.filter((log) => log.actorRole === activeTab);
  }, [logs, activeTab]);

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading) return <Loader />;

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Audit Logs
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          System-wide chronological record of actions
        </p>
      </div>

      {/* Filter + Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Days Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">
            Show logs from:
          </label>

          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="
              border border-gray-200 rounded-lg
              px-3 py-1.5 text-sm
              focus:ring-2 focus:ring-indigo-500
              outline-none
            "
          >
            <option value={1}>Last 24 hours</option>
            <option value={3}>Last 3 days</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
              className={`
                px-4 py-1.5 rounded-lg text-sm font-medium transition
                ${activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Actor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Description
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-sm text-gray-400">
                  No audit logs found for selected filter
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => (
                <AuditLogRow key={log.id} log={log} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="
              px-3 py-1.5 text-sm rounded-lg border
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-gray-50
            "
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`
                px-3 py-1.5 text-sm rounded-lg border transition
                ${page === currentPage
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white hover:bg-gray-50'
                }
              `}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="
              px-3 py-1.5 text-sm rounded-lg border
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-gray-50
            "
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;