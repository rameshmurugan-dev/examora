/**
 * ================================================================
 * AvailableExams
 * ================================================================
 * Lists all available exams.
 * ================================================================
 */

import { useState, useEffect } from 'react';
import Loader from '../../../../shared/components/Loader';
import ExamCard from '../components/ExamCard';
import { fetchAvailableExams } from '../services/examService';

const AvailableExams = () => {

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadExams = async () => {
            try {
                const data = await fetchAvailableExams();
                setExams(data || []);
            } catch (error) {
                console.error('Failed to load exams', error);
            } finally {
                setLoading(false);
            }
        };

        loadExams();

    }, []);

    if (loading) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Available Exams
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {exams.map(exam => (
                    <ExamCard key={exam.id} exam={exam} />
                ))}

                {exams.length === 0 && (
                    <div className="col-span-full p-12 text-center text-gray-500">
                        No exams found. Check back later!
                    </div>
                )}

            </div>

        </div>
    );
};

export default AvailableExams;