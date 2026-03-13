package com.examora.backend.attempt.repository;

import com.examora.backend.attempt.entity.AttemptAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for managing answers within exam attempts.
 *
 * Responsibilities:
 * - Ensure one answer per question per attempt
 * - Provide fast retrieval for attempt review
 *
 * Layer: Repository
 */
@Repository
public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswer, Long> {

        /**
         * Fetch all answers for a specific attempt.
         */
        List<AttemptAnswer> findByAttemptId(Long attemptId);

        /**
         * Fetch answer for specific question in attempt.
         */
        Optional<AttemptAnswer> findByAttemptIdAndExamQuestionId(
                        Long attemptId,
                        Long examQuestionId);

        /**
         * Fetch all answers across attempts for an exam.
         * Used in analytics.
         */
        List<AttemptAnswer> findByAttempt_Exam_Id(Long examId);

        /**
         * Count answers for attempt (useful for result calculation).
         */
        long countByAttemptId(Long attemptId);

        /**
         * Fetch answers for an exam filtered by attempt status.
         * Used for analytics to avoid in-memory filtering.
         */
        List<AttemptAnswer> findByAttempt_Exam_IdAndAttempt_StatusIn(
                        Long examId,
                        List<com.examora.backend.attempt.entity.AttemptStatus> statuses);

        /**
         * Fetch answers for multiple attempts in single query.
         * Prevents N+1 query issue.
         */
        List<AttemptAnswer> findByAttemptIdIn(List<Long> attemptIds);

        @Query("""
                        SELECT a.examQuestion.id,
                               COUNT(a),
                               SUM(CASE WHEN a.selectedOption = q.correctOption THEN 1 ELSE 0 END)
                        FROM AttemptAnswer a
                        JOIN a.examQuestion q
                        WHERE a.attempt.exam.id = :examId
                        AND a.attempt.status IN :statuses
                        GROUP BY a.examQuestion.id
                        """)
        List<Object[]> getQuestionStats(
                        Long examId,
                        List<com.examora.backend.attempt.entity.AttemptStatus> statuses);
}