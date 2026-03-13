/**
 * Admin Analytics Page
 * ----------------------------------------------------
 * Fetches and displays:
 * - Exam Overview
 * - Section Analytics
 * - Question Analytics
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import analyticsService from '../services/analyticsService';

import Loader from '../../../../shared/components/Loader';
import ExamSelector from '../components/ExamSelector';
import ExamOverviewCards from '../components/ExamOverviewCards';
import SectionPerformanceTable from '../components/SectionPerformanceTable';
import QuestionPerformanceTable from '../components/QuestionPerformanceTable';

const Analytics = () => {
    const [searchParams] = useSearchParams();

    // ---------------- State ----------------
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState(null);

    const [examStats, setExamStats] = useState(null);
    const [sectionStats, setSectionStats] = useState([]);
    const [questionStats, setQuestionStats] = useState([]);

    const [loadingExams, setLoadingExams] = useState(true);
    const [loadingStats, setLoadingStats] = useState(false);

    // ---------------- Load Exams ----------------
    const fetchExams = useCallback(async () => {
        try {
            const data = await analyticsService.getAllExams();
            setExams(data ?? []);

            const examFromUrl = searchParams.get('exam');
            if (examFromUrl) {
                setSelectedExamId(Number(examFromUrl));
            }
        } catch (error) {
            console.error('Failed to fetch exams:', error);
        } finally {
            setLoadingExams(false);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    // ---------------- Load Analytics ----------------
    const fetchAnalytics = useCallback(async (examId) => {
        setLoadingStats(true);

        try {
            const [stats, sections, questions] = await Promise.all([
                analyticsService.getExamStats(examId),
                analyticsService.getSectionStats(examId),
                analyticsService.getQuestionStats(examId)
            ]);

            setExamStats(stats ?? {});
            setSectionStats(sections ?? []);
            setQuestionStats(questions ?? []);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoadingStats(false);
        }
    }, []);

    useEffect(() => {
        if (selectedExamId) {
            fetchAnalytics(selectedExamId);
        }
    }, [selectedExamId, fetchAnalytics]);

    if (loadingExams) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <ExamSelector
                exams={exams}
                selectedExamId={selectedExamId}
                onSelect={setSelectedExamId}
                loading={loadingStats}
            />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
                {!selectedExamId ? (
                    <div className="text-center py-20 text-gray-500">
                        Select an exam to view analytics.
                    </div>
                ) : loadingStats ? (
                    <div className="py-20 flex justify-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <ExamOverviewCards stats={examStats} />
                        <SectionPerformanceTable sections={sectionStats} />
                        <QuestionPerformanceTable questions={questionStats} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default Analytics;