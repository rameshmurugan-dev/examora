package com.examora.backend.analytics.service;

import com.examora.backend.analytics.dto.*;
import com.examora.backend.attempt.entity.AttemptAnswer;
import com.examora.backend.attempt.entity.AttemptStatus;
import com.examora.backend.attempt.entity.ExamAttempt;
import com.examora.backend.attempt.repository.AttemptAnswerRepository;
import com.examora.backend.common.exception.ResourceNotFoundException;
import com.examora.backend.exam.entity.Exam;
import com.examora.backend.exam.entity.ExamQuestion;
import com.examora.backend.exam.repository.ExamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Production-grade Analytics Service.
 *
 * Responsibilities:
 * - Admin ownership validation
 * - Efficient aggregation
 * - No in-memory filtering abuse
 * - Scalable grouping logic
 *
 * Layer: Service
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final ExamRepository examRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;

    private static final List<AttemptStatus> VALID_STATUSES = List.of(AttemptStatus.SUBMITTED,
            AttemptStatus.AUTO_SUBMITTED);

    // ============================================================
    // EXAM SUMMARY (ALL EXAMS FOR ADMIN)
    // ============================================================

    public List<ExamAnalyticsSummaryDTO> getAllExamsAnalytics(Long adminId) {

        List<Exam> exams = examRepository.findByCreatedBy(adminId);

        return exams.stream()
                .map(this::buildExamSummary)
                .collect(Collectors.toList());
    }

    // ============================================================
    // SINGLE EXAM DETAIL
    // ============================================================

    public ExamAnalyticsDetailDTO getExamAnalyticsDetail(Long adminId, Long examId) {
        Exam exam = getValidatedExam(adminId, examId);
        return buildExamDetail(exam);
    }

    // ============================================================
    // SECTION ANALYTICS
    // ============================================================

    public List<SectionAnalyticsDTO> getSectionAnalytics(Long adminId, Long examId) {

        Exam exam = getValidatedExam(adminId, examId);

        List<AttemptAnswer> answers = fetchValidAnswers(examId);

        Map<Long, List<AttemptAnswer>> answersByQuestion = answers.stream()
                .collect(Collectors.groupingBy(a -> a.getExamQuestion().getId()));

        long participants = answers.stream()
                .map(a -> a.getAttempt().getId())
                .distinct()
                .count();

        List<SectionAnalyticsDTO> result = new ArrayList<>();

        for (var section : exam.getExamSections()) {

            double totalMarks = 0;
            int questionCount = 0;
            int correctCount = 0;
            int attemptCount = 0;

            for (var subSection : section.getSubSections()) {
                for (ExamQuestion q : subSection.getQuestions()) {

                    if (q.isRemoved())
                        continue;

                    questionCount++;

                    List<AttemptAnswer> qAnswers = answersByQuestion.getOrDefault(q.getId(), Collections.emptyList());

                    for (AttemptAnswer ans : qAnswers) {
                        attemptCount++;

                        if (Objects.equals(ans.getSelectedOption(), q.getCorrectOption())) {
                            correctCount++;
                            totalMarks += q.getMarks();
                        } else {
                            totalMarks -= getNegativeMark(exam);
                        }

                        /* Prevent negative score */
                        if (totalMarks < 0) {
                            totalMarks = 0;
                        }
                    }
                }
            }

            double avgMarks = participants > 0 ? totalMarks / participants : 0;
            double accuracy = attemptCount > 0
                    ? ((double) correctCount / attemptCount) * 100
                    : 0;

            result.add(SectionAnalyticsDTO.builder()
                    .sectionId(section.getId())
                    .sectionName(section.getTitle())
                    .averageMarks(avgMarks)
                    .accuracyPercentage(accuracy)
                    .questionCount(questionCount)
                    .build());
        }

        return result;
    }

    // ============================================================
    // QUESTION ANALYTICS
    // ============================================================

    public List<QuestionAnalyticsDTO> getQuestionAnalytics(Long adminId, Long examId) {

        Exam exam = getValidatedExam(adminId, examId);

        List<Object[]> stats = attemptAnswerRepository.getQuestionStats(examId, VALID_STATUSES);

        Map<Long, Object[]> statsMap = stats.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> row));

        List<QuestionAnalyticsDTO> result = new ArrayList<>();

        for (var section : exam.getExamSections()) {
            for (var subSection : section.getSubSections()) {
                for (ExamQuestion q : subSection.getQuestions()) {

                    if (q.isRemoved())
                        continue;

                    Object[] row = statsMap.get(q.getId());

                    long totalAnswers = row == null ? 0 : ((Number) row[1]).longValue();
                    long correctCount = row == null ? 0 : ((Number) row[2]).longValue();

                    /* Skip count = answers not given */
                    long skipCount = Math.max(0, totalAnswers - correctCount);

                    double correctPct = totalAnswers > 0
                            ? (double) correctCount / totalAnswers * 100
                            : 0;

                    double skipPct = totalAnswers > 0
                            ? (double) skipCount / totalAnswers * 100
                            : 0;

                    String difficulty;

                    if (totalAnswers == 0) {
                        difficulty = "UNKNOWN";
                    } else if (correctPct > 70) {
                        difficulty = "EASY";
                    } else if (correctPct > 30) {
                        difficulty = "MEDIUM";
                    } else {
                        difficulty = "HARD";
                    }

                    result.add(QuestionAnalyticsDTO.builder()
                            .questionId(q.getId())
                            .questionText(q.getQuestionText())
                            .correctPercentage(correctPct)
                            .skipPercentage(skipPct)
                            .difficultyLevel(difficulty)
                            .build());
                }
            }
        }

        return result;
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private List<AttemptAnswer> fetchValidAnswers(Long examId) {
        return attemptAnswerRepository
                .findByAttempt_Exam_IdAndAttempt_StatusIn(examId, VALID_STATUSES);
    }

    private Exam getValidatedExam(Long adminId, Long examId) {

        Exam exam = examRepository.findFullStructureById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        if (!exam.getCreatedBy().equals(adminId)) {
            throw new ResourceNotFoundException("Exam not found or access denied");
        }

        return exam;
    }

    private double getNegativeMark(Exam exam) {
        BigDecimal neg = exam.getNegativeMarks();
        return neg != null ? neg.doubleValue() : 0;
    }

    private ExamAnalyticsSummaryDTO buildExamSummary(Exam exam) {
        ExamAnalyticsDetailDTO detail = buildExamDetail(exam);

        return ExamAnalyticsSummaryDTO.builder()
                .examId(detail.getExamId())
                .title(detail.getTitle())
                .totalAttempts(detail.getTotalAttempts())
                .averageScore(detail.getAverageScore())
                .passPercentage(detail.getPassPercentage())
                .avgCompletionTimeSeconds(detail.getAvgCompletionTimeSeconds())
                .build();
    }

    private ExamAnalyticsDetailDTO buildExamDetail(Exam exam) {

        List<AttemptAnswer> answers = fetchValidAnswers(exam.getId());

        Map<Long, List<AttemptAnswer>> answersByAttempt = answers.stream()
                .collect(Collectors.groupingBy(a -> a.getAttempt().getId()));

        long totalAttempts = answersByAttempt.size();

        double totalScore = 0;
        double passCount = 0;
        double totalTime = 0;

        for (Map.Entry<Long, List<AttemptAnswer>> entry : answersByAttempt.entrySet()) {

            ExamAttempt attempt = entry.getValue().get(0).getAttempt();

            double score = calculateScore(exam, entry.getValue());

            totalScore += score;

            if (score >= exam.getTotalMarks() * 0.40) {
                passCount++;
            }

            if (attempt.getSubmittedAt() != null) {
                totalTime += Duration.between(
                        attempt.getStartedAt(),
                        attempt.getSubmittedAt()).getSeconds();
            }
        }

        return ExamAnalyticsDetailDTO.builder()
                .examId(exam.getId())
                .title(exam.getTitle())
                .totalAttempts(totalAttempts)
                .averageScore(totalAttempts > 0 ? totalScore / totalAttempts : 0)
                .passPercentage(totalAttempts > 0 ? (passCount / totalAttempts) * 100 : 0)
                .avgCompletionTimeSeconds(totalAttempts > 0 ? totalTime / totalAttempts : 0)
                .build();
    }

    private double calculateScore(Exam exam, List<AttemptAnswer> answers) {

        double score = 0;

        for (AttemptAnswer ans : answers) {

            if (Objects.equals(ans.getSelectedOption(),
                    ans.getExamQuestion().getCorrectOption())) {

                score += ans.getExamQuestion().getMarks();

            } else {
                score -= getNegativeMark(exam);
            }
        }

        return Math.max(score, 0);
    }
}