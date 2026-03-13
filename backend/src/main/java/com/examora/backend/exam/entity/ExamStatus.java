package com.examora.backend.exam.entity;

/**
 * Exam lifecycle state.
 */
public enum ExamStatus {
    DRAFT, // Editable
    PUBLISHED, // Live for students
    CLOSED // No longer attemptable
}