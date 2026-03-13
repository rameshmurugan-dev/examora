/**
 * Application Routes.
 * Central routing configuration with role-based protection and layouts.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Login from '../../features/auth/pages/Login';

// Layouts
import SuperAdminLayout from '../../layouts/SuperAdminLayout';
import AdminLayout from '../../layouts/AdminLayout';
import StudentLayout from '../../layouts/StudentLayout';

// Admin Pages
import QuestionBank from '../../features/admin/question-bank/pages/QuestionBank';
import ExamBuilder from '../../features/admin/exam-builder/pages/ExamBuilder';
import AdminDashboard from '../../features/admin/dashboard/pages/Dashboard';
import Analytics from '../../features/admin/analytics/pages/Analytics';
import MyExams from '../../features/admin/my-exams/pages/MyExams';

// Super Admin Pages
import SuperDashboard from '../../features/super-admin/dashboard/pages/Dashboard';
import AdminManagement from '../../features/super-admin/admins/pages/AdminManagement';
import StudentManagement from '../../features/super-admin/students/pages/StudentManagement';
import AuditLogs from '../../features/super-admin/audit-logs/pages/AuditLogs';

// Student Pages
import StudentDashboard from '../../features/student/dashboard/pages/Dashboard';
import AvailableExams from '../../features/student/exams/pages/AvailableExams';
import ExamDetail from '../../features/student/exams/pages/ExamDetail';
import ResultList from '../../features/student/attempts/pages/ResultList';
import AttemptExam from '../../features/student/attempts/pages/AttemptExam';
import AttemptResult from '../../features/student/attempts/pages/AttemptResult';
import AttemptReview from '../../features/student/attempts/pages/AttemptReview';
import ActivateAccount from '../../features/auth/pages/ActivateAccount';

import ProtectedRoute from './ProtectedRoute';
import ProfilePage from '../../features/common/ProfilePage';

// Placeholder component for Unauthorized access
const Unauthorized = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600">403</h1>
            <p className="mt-2 text-lg text-gray-700">Unauthorized Access</p>
            <a href="/login" className="mt-4 text-indigo-600 hover:text-indigo-500">Back to Login</a>
        </div>
    </div>
);

// Placeholder for 404
const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
            <p className="mt-2 text-lg text-gray-700">Page Not Found</p>
        </div>
    </div>
);

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/activate" element={<ActivateAccount />} />
            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes - SUPER_ADMIN */}
            {/* Using Nested Routes with Layout */}
            <Route
                path="/super-admin"
                element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <SuperAdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<SuperDashboard />} />
                <Route path="admins" element={<AdminManagement />} />
                <Route path="students" element={<StudentManagement />} />
                <Route path="audit-logs" element={<AuditLogs />} />

                <Route path="profile" element={<ProfilePage />} />

                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Routes - ADMIN */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="question-bank" element={<QuestionBank />} />
                <Route path="exams" element={<ExamBuilder />} />
                <Route path="my-exams" element={<MyExams />} />
                <Route path="analytics" element={<Analytics />} />

                <Route path="profile" element={<ProfilePage />} />

                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Routes - STUDENT */}
            <Route
                path="/student"
                element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                        <StudentLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="exams" element={<AvailableExams />} />
                <Route path="exams/:examId" element={<ExamDetail />} />
                <Route path="history" element={<ResultList />} />

                {/* Exam Attempt Routes */}
                <Route path="attempt/:attemptId" element={<AttemptExam />} />
                <Route path="attempt/:attemptId/result" element={<AttemptResult />} />
                <Route path="attempt/:attemptId/review" element={<AttemptReview />} />

                <Route path="profile" element={<ProfilePage />} />

                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
