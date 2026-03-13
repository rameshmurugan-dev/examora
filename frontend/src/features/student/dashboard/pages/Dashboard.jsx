/**
 * ================================================================
 * Student Dashboard
 * ================================================================
 * Main landing page for students.
 *
 * Displays:
 *  - Statistics
 *  - Available Exams
 *  - Recent Activity
 * ================================================================
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../../../shared/components/Loader';
import DashboardStats from '../components/DashboardStats';
import ExamCard from '../../exams/components/ExamCard';
import { fetchStudentDashboard } from '../services/studentDashboardService';

const Dashboard = () => {

    /* ============================================================
       State
    ============================================================ */

    const [data, setData] = useState({
        stats: null,
        recentExams: [],
        recentAttempts: []
    });

    const [loading, setLoading] = useState(true);

    /* ============================================================
       Effects
    ============================================================ */

    useEffect(() => {

        const loadDashboard = async () => {
            try {
                const dashboardData =
                    await fetchStudentDashboard();

                setData(dashboardData || {
                    stats: null,
                    recentExams: [],
                    recentAttempts: []
                });

            } catch (error) {
                console.error(
                    'Dashboard fetch failed',
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();

    }, []);

    /* ============================================================
       Loading
    ============================================================ */

    if (loading) return <Loader />;

    /* ============================================================
       Render
    ============================================================ */

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Student Dashboard
            </h1>

            <DashboardStats stats={data.stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Available Exams */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">
                            Available Exams
                        </h2>
                        <Link
                            to="/student/exams"
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.recentExams?.slice(0, 4).map(exam => (
                            <ExamCard key={exam.id} exam={exam} />
                        ))}

                        {(!data.recentExams ||
                            data.recentExams.length === 0) && (
                                <div className="col-span-2 p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                                    No exams available at the moment.
                                </div>
                            )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">

                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">
                            Recent Activity
                        </h2>
                        <Link
                            to="/student/history"
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                            View History →
                        </Link>
                    </div>

                    <RecentActivityTable
                        attempts={data.recentAttempts}
                    />

                </div>
            </div>
        </div>
    );
};

/* ============================================================
   Internal Component: Recent Activity Table
============================================================ */

const RecentActivityTable = ({ attempts = [] }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

                {attempts.map(attempt => (
                    <tr key={attempt.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {attempt.examTitle}
                        </td>
                        <td className="px-4 py-3 text-sm">
                            {attempt.status === 'SUBMITTED'
                                ? (
                                    <span className="text-green-600 font-medium">
                                        Completed
                                    </span>
                                )
                                : (
                                    <Link
                                        to={`/student/attempt/${attempt.id}`}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        Continue
                                    </Link>
                                )
                            }
                        </td>
                    </tr>
                ))}

                {attempts.length === 0 && (
                    <tr>
                        <td colSpan="2" className="px-4 py-8 text-center text-sm text-gray-500">
                            No recent activity.
                        </td>
                    </tr>
                )}

            </tbody>

        </table>
    </div>
);

export default Dashboard;