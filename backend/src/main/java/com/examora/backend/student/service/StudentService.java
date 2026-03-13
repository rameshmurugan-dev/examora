package com.examora.backend.student.service;

import com.examora.backend.attempt.entity.*;
import com.examora.backend.attempt.repository.*;
import com.examora.backend.common.exception.ResourceNotFoundException;
import com.examora.backend.exam.entity.*;
import com.examora.backend.exam.repository.ExamRepository;
import com.examora.backend.security.UserDetailsImpl;
import com.examora.backend.student.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Handles all student-facing read operations:
 * - Dashboard
 * - Exam listing
 * - Attempt history
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService {

    private final ExamRepository examRepository;
    private final ExamAttemptRepository examAttemptRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;

    /**
     * Extract currently logged-in student ID safely.
     */
    private Long getCurrentStudentId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl userDetails)) {
            throw new IllegalStateException("Invalid authentication context");
        }

        return userDetails.getId();
    }

    // ============================================================
    // DASHBOARD
    // ============================================================

    /**
     * Returns dashboard statistics (accuracy based).
     */
    public StudentDashboardDTO getDashboardStats() {

        Long studentId = getCurrentStudentId();

        long totalAvailable = examRepository.countByStatus(ExamStatus.PUBLISHED);

        List<ExamAttempt> attempts = examAttemptRepository.findByStudentId(studentId);

        // Filter completed attempts only
        List<ExamAttempt> completed = attempts.stream()
                .filter(a -> a.getStatus() == AttemptStatus.SUBMITTED
                        || a.getStatus() == AttemptStatus.AUTO_SUBMITTED)
                .toList();

        if (completed.isEmpty()) {
            return StudentDashboardDTO.builder()
                    .totalAvailable(totalAvailable)
                    .completedAttempts(0L)
                    .averageScore(0.0)
                    .build();
        }

        // Fetch answers in one query (avoid N+1)
        List<Long> attemptIds = completed.stream()
                .map(ExamAttempt::getId)
                .toList();

        List<AttemptAnswer> allAnswers =
                attemptAnswerRepository.findByAttemptIdIn(attemptIds);

        Map<Long, List<AttemptAnswer>> grouped =
                allAnswers.stream()
                        .collect(Collectors.groupingBy(a -> a.getAttempt().getId()));

        int totalQuestions = 0;
        int totalCorrect = 0;

        for (ExamAttempt attempt : completed) {

            List<AttemptAnswer> answers =
                    grouped.getOrDefault(attempt.getId(), List.of());

            for (AttemptAnswer ans : answers) {

                totalQuestions++;

                if (ans.getSelectedOption()
                        .equals(ans.getExamQuestion().getCorrectOption())) {
                    totalCorrect++;
                }
            }
        }

        double accuracy = totalQuestions > 0
                ? ((double) totalCorrect / totalQuestions) * 100
                : 0.0;

        return StudentDashboardDTO.builder()
                .totalAvailable(totalAvailable)
                .completedAttempts((long) completed.size())
                .averageScore(accuracy)
                .build();
    }

    // ============================================================
    // EXAM LIST
    // ============================================================

    /**
     * Returns all published exams with attempt status.
     */
    public List<StudentExamDTO> getAvailableExams() {

        Long studentId = getCurrentStudentId();

        List<Exam> exams = examRepository.findByStatus(ExamStatus.PUBLISHED);
        List<ExamAttempt> attempts = examAttemptRepository.findByStudentId(studentId);

        // Map examId -> status
        Map<Long, AttemptStatus> attemptMap =
                attempts.stream()
                        .collect(Collectors.toMap(
                                a -> a.getExam().getId(),
                                ExamAttempt::getStatus,
                                (existing, ignored) -> existing
                        ));

        return exams.stream()
                .map(exam -> {

                    String status = "NOT_STARTED";

                    AttemptStatus attemptStatus = attemptMap.get(exam.getId());

                    if (attemptStatus != null) {
                        if (attemptStatus == AttemptStatus.IN_PROGRESS) {
                            status = "IN_PROGRESS";
                        } else {
                            status = "COMPLETED";
                        }
                    }

                    return StudentExamDTO.builder()
                            .id(exam.getId())
                            .title(exam.getTitle())
                            .description(exam.getDescription())
                            .durationMinutes(exam.getDurationMinutes())
                            .totalMarks(exam.getTotalMarks())
                            .attemptStatus(status)
                            .build();
                })
                .toList();
    }

    // ============================================================
    // EXAM DETAILS
    // ============================================================

    /**
     * Returns exam info before starting.
     */
    public StudentExamDetailDTO getExamDetails(Long examId) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        if (exam.getStatus() != ExamStatus.PUBLISHED) {
            throw new ResourceNotFoundException("Exam not available");
        }

        return StudentExamDetailDTO.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .durationMinutes(exam.getDurationMinutes())
                .totalMarks(exam.getTotalMarks())
                .negativeMarks(exam.getNegativeMarks())
                .build();
    }

    // ============================================================
    // ATTEMPTS
    // ============================================================

    /**
     * Returns student's attempt history.
     */
    public List<StudentAttemptDTO> getAttemptHistory() {

        Long studentId = getCurrentStudentId();

        return examAttemptRepository.findByStudentId(studentId)
                .stream()
                .sorted(Comparator.comparing(ExamAttempt::getStartedAt).reversed())
                .map(this::mapToAttemptDTO)
                .toList();
    }

    /**
     * Returns details of a specific attempt.
     */
    public StudentAttemptDTO getAttemptDetails(Long attemptId) {

        Long studentId = getCurrentStudentId();

        ExamAttempt attempt =
                examAttemptRepository.findByIdAndStudentId(attemptId, studentId)
                        .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));

        return mapToAttemptDTO(attempt);
    }

    /**
     * Calculates final score of submitted attempt.
     */
    private StudentAttemptDTO mapToAttemptDTO(ExamAttempt attempt) {

        BigDecimal score = BigDecimal.ZERO;

        if (attempt.getStatus() == AttemptStatus.SUBMITTED
                || attempt.getStatus() == AttemptStatus.AUTO_SUBMITTED) {

            List<AttemptAnswer> answers =
                    attemptAnswerRepository.findByAttemptId(attempt.getId());

            for (AttemptAnswer ans : answers) {

                if (ans.getSelectedOption()
                        .equals(ans.getExamQuestion().getCorrectOption())) {

                    score = score.add(
                            BigDecimal.valueOf(ans.getExamQuestion().getMarks())
                    );

                } else if (attempt.getExam().getNegativeMarks()
                        .compareTo(BigDecimal.ZERO) > 0) {

                    score = score.subtract(
                            attempt.getExam().getNegativeMarks()
                    );
                }
            }

            if (score.compareTo(BigDecimal.ZERO) < 0) {
                score = BigDecimal.ZERO;
            }
        }

        return StudentAttemptDTO.builder()
                .id(attempt.getId())
                .examId(attempt.getExam().getId())
                .examTitle(attempt.getExam().getTitle())
                .startedAt(attempt.getStartedAt())
                .submittedAt(attempt.getSubmittedAt())
                .status(attempt.getStatus())
                .score(score.doubleValue())
                .totalMarks(attempt.getExam().getTotalMarks())
                .build();
    }

    /**
     * Aggregated dashboard response.
     */
    public StudentDashboardResponseDTO getDashboardData() {

        return StudentDashboardResponseDTO.builder()
                .stats(getDashboardStats())
                .recentExams(getAvailableExams().stream().limit(4).toList())
                .recentAttempts(getAttemptHistory().stream().limit(5).toList())
                .build();
    }
}