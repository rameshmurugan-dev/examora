package com.examora.backend.attempt.repository;

import com.examora.backend.attempt.entity.ExamAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for managing exam attempts.
 *
 * Business rule:
 * - One attempt per student per exam
 *
 * Layer: Repository
 */
@Repository
public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {

    /**
     * Find attempt by id and student.
     * Used for ownership validation.
     */
    Optional<ExamAttempt> findByIdAndStudentId(Long id, Long studentId);

    /**
     * Fetch attempt for specific exam and student.
     * (Unique per business rule)
     */
    Optional<ExamAttempt> findByExam_IdAndStudent_Id(Long examId, Long studentId);

    /**
     * List all attempts of a student.
     */
    List<ExamAttempt> findByStudentId(Long studentId);

    /**
     * List all attempts for an exam.
     * Useful for analytics.
     */
    List<ExamAttempt> findByExamId(Long examId);
}