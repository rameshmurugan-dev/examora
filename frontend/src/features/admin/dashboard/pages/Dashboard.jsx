/**
 * Admin Dashboard Page
 * ----------------------------------------------------
 * Displays:
 * - Total exams
 * - Published exams
 * - Total attempts
 * - Recent exams table
 *
 * Uses dashboardService for API calls.
 */

import React, { useState, useEffect, useCallback } from 'react';
import Loader from '../../../../shared/components/Loader';
import DashboardStatCard from '../components/DashboardStatCard';
import RecentExamRow from '../components/RecentExamRow';
import dashboardService from '../services/adminDashboardService';

const Dashboard = () => {

    // ---------------- State ----------------
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalExams: 0,
        publishedExams: 0,
        totalAttempts: 0,
        mergedExams: []
    });

    // ---------------- Fetch Dashboard Data ----------------
    const fetchDashboardData = useCallback(async () => {
        try {
            const [exams, analytics] = await Promise.all([
                dashboardService.getAllExams(),
                dashboardService.getExamAnalytics()
            ]);

            const totalExams = exams.length;
            const publishedExams =
                exams.filter(e => e.status === 'PUBLISHED').length;

            let totalAttempts = 0;

            // Optimize lookup (O(n) instead of O(n²))
            const analyticsMap = new Map();
            analytics.forEach(a => {
                analyticsMap.set(a.examId, a);
            });

            const mergedExams = exams.map(exam => {
                const stat = analyticsMap.get(exam.id);

                const attempts = Number(stat?.totalAttempts ?? 0);
                totalAttempts += attempts;

                return {
                    ...exam,
                    totalAttempts: attempts,
                    averageScore: stat?.averageScore ?? null
                };
            });

            setStats({
                totalExams,
                publishedExams,
                totalAttempts,
                mergedExams: mergedExams.slice(0, 10)
            });

        } catch (error) {
            console.error('Failed to load admin dashboard:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) return <Loader />;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Admin Dashboard
            </h1>

            {/* ----------- Stats Cards ----------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DashboardStatCard
                    label="Total Exams"
                    value={stats.totalExams}
                    color="blue"
                />
                <DashboardStatCard
                    label="Published Exams"
                    value={stats.publishedExams}
                    color="green"
                />
                <DashboardStatCard
                    label="Total Student Attempts"
                    value={stats.totalAttempts}
                    color="indigo"
                />
            </div>

            {/* ----------- Recent Exams Table ----------- */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between">
                    <h2 className="font-semibold text-gray-800">
                        Recent Exams
                    </h2>
                    <span className="text-xs text-gray-500">
                        Top 10
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Exam</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Attempts</th>
                                <th className="px-6 py-3">Avg Score</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {stats.mergedExams.map(exam => (
                                <RecentExamRow key={exam.id} exam={exam} />
                            ))}

                            {!stats.mergedExams.length && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-gray-400"
                                    >
                                        No exams created yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;