/**
 * ================================================================
 * ExamDetail
 * ================================================================
 * Displays exam information and handles exam start.
 * ================================================================
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../../../shared/components/Loader';
import {
    fetchExamDetail,
    startExam
} from '../services/examService';

const ExamDetail = () => {

    const { examId } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        const loadExam = async () => {
            try {
                const data = await fetchExamDetail(examId);
                setExam(data);
            } catch {
                setError('Failed to load exam details.');
            } finally {
                setLoading(false);
            }
        };

        loadExam();

    }, [examId]);

    const handleStartExam = async () => {
        setStarting(true);

        try {
            const data = await startExam(examId);
            const attemptId = data?.data?.id;
            navigate(`/student/attempt/${attemptId}`);
        } catch (err) {
            alert(err?.response?.data?.message || 'Failed to start exam');
            setStarting(false);
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!exam) return <div className="p-8 text-center bg-white rounded-lg shadow-sm">Exam not found or unavailable.</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">

                <div className="bg-indigo-600 p-6 text-white text-center">
                    <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
                    <p className="opacity-90">{exam.description || 'No description provided.'}</p>
                </div>

                <div className="p-8 space-y-6">

                    <div className="grid grid-cols-2 gap-4 text-center">

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="block text-gray-500 text-sm uppercase">Duration</span>
                            <span className="text-xl font-bold text-gray-800">
                                {exam.durationMinutes} Minutes
                            </span>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="block text-gray-500 text-sm uppercase">Total Marks</span>
                            <span className="text-xl font-bold text-gray-800">
                                {exam.totalMarks || 'N/A'}
                            </span>
                        </div>

                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleStartExam}
                            disabled={starting}
                            className="w-full bg-indigo-600 text-white text-lg font-bold py-4 rounded-lg hover:bg-indigo-700 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                        >
                            {starting ? 'Starting Exam...' : 'Start Exam Now'}
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ExamDetail;