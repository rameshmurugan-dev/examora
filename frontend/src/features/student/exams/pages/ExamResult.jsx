/**
 * ================================================================
 * ExamResult
 * ================================================================
 * Displays final result after submission validation.
 * ================================================================
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import ResultSummaryCard from '../../../../components/student/ResultSummaryCard';
import {
    fetchAttemptDetails,
    fetchAttemptResult
} from '../services/examService';

const ExamResult = () => {

    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const loadResult = async () => {

            try {
                const attempt = await fetchAttemptDetails(attemptId);

                if (attempt.status !== 'SUBMITTED') {
                    navigate('/student/dashboard');
                    return;
                }

                const resultData =
                    await fetchAttemptResult(attemptId);

                setResult(resultData);

            } catch {
                setError('Failed to load results. They might be pending calculation.');
            } finally {
                setLoading(false);
            }
        };

        loadResult();

    }, [attemptId, navigate]);

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-800">{error}</h2>
                    <Link to="/student/dashboard" className="mt-4 inline-block text-indigo-600 hover:underline">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

            <div className="max-w-3xl mx-auto">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">Exam Results</h1>
                    <p className="mt-2 text-gray-600">
                        Here is how you performed in your recent attempt.
                    </p>
                </div>

                <ResultSummaryCard
                    score={result.obtainedMarks}
                    totalMarks={result.totalMarks}
                    correctCount={result.correctCount}
                    wrongCount={result.wrongCount}
                    totalQuestions={result.totalQuestions}
                    accuracy={result.accuracyPercentage}
                />

                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        to="/student/dashboard"
                        className="px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to={`/student/attempt/${attemptId}/review`}
                        className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                    >
                        View Answer Key
                    </Link>
                </div>

            </div>

        </div>
    );
};

export default ExamResult;