import api from '../../../../core/api/axios';

/* ============================================================
   Available Exams
============================================================ */

export const fetchAvailableExams = async () => {
    const res = await api.get('/student/exams');
    return res.data.data;
};

/* ============================================================
   Exam Detail
============================================================ */

export const fetchExamDetail = async (examId) => {
    const res = await api.get(`/student/exams/${examId}`);
    return res.data.data;
};

/* ============================================================
   Start Exam
============================================================ */

export const startExam = async (examId) => {
    const res = await api.post(`/student/attempts/exams/${examId}/start`);
    return res.data;
};

/* ============================================================
   Attempt Detail
============================================================ */

export const fetchAttemptDetails = async (attemptId) => {
    const res = await api.get(`/student/attempts/${attemptId}/details`);
    return res.data.data;
};

/* ============================================================
   Attempt Result
============================================================ */

export const fetchAttemptResult = async (attemptId) => {
    const res = await api.get(`/student/attempts/${attemptId}/result`);
    return res.data.data;
};