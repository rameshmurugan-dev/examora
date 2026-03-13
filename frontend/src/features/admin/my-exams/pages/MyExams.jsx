import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from '../../../../shared/components/Loader';
import ExamStatusBadge from '../../../../shared/components/badges/ExamStatusBadge';
import ConfirmDialog from '../../../../shared/components/ConfirmDialog';

import {
    fetchAdminExams,
    publishExam,
    closeExam,
    deleteExam
} from '../services/myExamService';

/**
 * MyExams Component
 * -------------------------------------------------------
 * Admin panel page for managing created exams.
 *
 * Features:
 * - List all exams
 * - Search by title
 * - Filter by status
 * - Publish draft exams
 * - Close published exams
 * - Delete draft exams
 *
 * Architecture Notes:
 * - API calls are fully abstracted into service layer
 * - UI state isolated
 * - Memoized filtering for performance
 */
const MyExams = () => {

    const navigate = useNavigate();

    /** -----------------------------
     * State Management
     * ----------------------------- */
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [confirmDelete, setConfirmDelete] = useState(null);

    /** -----------------------------
     * Data Fetching
     * ----------------------------- */
    const loadExams = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchAdminExams();
            setExams(data);
        } catch (error) {
            console.error('Failed to load exams:', error);
            alert('Failed to load exams. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadExams();
    }, [loadExams]);

    /** -----------------------------
     * Actions
     * ----------------------------- */

    const handlePublish = async (examId) => {
        try {
            await publishExam(examId);
            await loadExams();
        } catch (error) {
            alert(error.response?.data?.message || 'Publish failed');
        }
    };

    const handleClose = async (examId) => {
        const confirmed = window.confirm(
            'Are you sure you want to close this exam?'
        );
        if (!confirmed) return;

        try {
            await closeExam(examId);
            await loadExams();
        } catch (error) {
            alert(error.response?.data?.message || 'Close failed');
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;

        try {
            await deleteExam(confirmDelete.id);
            await loadExams();
        } catch (error) {
            alert(error.response?.data?.message || 'Delete failed');
        } finally {
            setConfirmDelete(null);
        }
    };

    /** -----------------------------
     * Derived State (Optimized)
     * ----------------------------- */
    const filteredExams = useMemo(() => {
        return exams
            .filter(exam =>
                (exam.title || '')
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
            .filter(exam =>
                statusFilter === 'ALL'
                    ? true
                    : exam.status === statusFilter
            );
    }, [exams, search, statusFilter]);

    /** -----------------------------
     * Loading State
     * ----------------------------- */
    if (loading) return <Loader />;

    /** -----------------------------
     * Render
     * ----------------------------- */
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        My Exams
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage & control your exams
                    </p>
                </div>

                <button
                    onClick={() => navigate('/admin/exams')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                    + Create Exam
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 mb-4">

                <input
                    type="text"
                    placeholder="Search exam..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                    <option value="ALL">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="CLOSED">Closed</option>
                </select>
            </div>

            {/* Exams Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">

                    <thead className="text-xs text-gray-500 uppercase border-b">
                        <tr>
                            <th className="py-3">Title</th>
                            <th>Mode</th>
                            <th>Duration</th>
                            <th>Marks</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredExams.map(exam => (
                            <tr
                                key={exam.id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="py-3 font-medium text-gray-800">
                                    {exam.title}
                                </td>

                                <td>{exam.examMode}</td>
                                <td>{exam.durationMinutes} mins</td>
                                <td>{exam.totalMarks}</td>

                                <td>
                                    <ExamStatusBadge status={exam.status} />
                                </td>

                                <td className="text-gray-500">
                                    {new Date(exam.createdAt).toLocaleDateString()}
                                </td>

                                <td className="text-right space-x-2">

                                    {/* Draft Actions */}
                                    {exam.status === 'DRAFT' && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/exams?edit=${exam.id}`)
                                                }
                                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handlePublish(exam.id)}
                                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                                            >
                                                Publish
                                            </button>

                                            <button
                                                onClick={() => setConfirmDelete(exam)}
                                                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}

                                    {/* Published Actions */}
                                    {exam.status === 'PUBLISHED' && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/analytics?exam=${exam.id}`)
                                                }
                                                className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                                            >
                                                Analytics
                                            </button>

                                            <button
                                                onClick={() => handleClose(exam.id)}
                                                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                                            >
                                                Close
                                            </button>
                                        </>
                                    )}

                                    {/* Closed */}
                                    {exam.status === 'CLOSED' && (
                                        <span className="text-xs text-gray-400">
                                            Closed
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {!filteredExams.length && (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="py-6 text-center text-gray-400"
                                >
                                    No exams found
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
                title="Delete Exam"
                message={`Are you sure you want to delete "${confirmDelete?.title}"?`}
                confirmText="Delete"
                isDangerous
            />

        </div>
    );
};

export default MyExams;