package com.examora.backend.result.service;

import com.examora.backend.attempt.dto.OptionDTO;
import com.examora.backend.attempt.entity.AttemptAnswer;
import com.examora.backend.attempt.entity.AttemptStatus;
import com.examora.backend.attempt.entity.ExamAttempt;
import com.examora.backend.attempt.repository.AttemptAnswerRepository;
import com.examora.backend.attempt.repository.ExamAttemptRepository;
import com.examora.backend.common.exception.InvalidActionException;
import com.examora.backend.common.exception.ResourceNotFoundException;
import com.examora.backend.exam.entity.ExamQuestion;
import com.examora.backend.result.dto.AnswerStatus;
import com.examora.backend.result.dto.AttemptAnswerDetailDTO;
import com.examora.backend.result.dto.ResultDTO;
import com.examora.backend.result.dto.SubmissionType;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Production-grade Result Service.
 *
 * Responsibilities:
 * - Validate ownership
 * - Ensure attempt completed
 * - Calculate final score safely
 * - Provide detailed answer breakdown
 *
 * Layer: Service
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResultService {

    private final ExamAttemptRepository examAttemptRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;

    // ============================================================
    // PUBLIC API
    // ============================================================

    public ResultDTO getResult(Long studentId, Long attemptId) {

        ExamAttempt attempt = getValidatedAttempt(studentId, attemptId);

        List<ExamQuestion> questions = getActiveQuestions(attempt);
        List<AttemptAnswer> answers = attemptAnswerRepository.findByAttemptId(attemptId);

        Map<Long, AttemptAnswer> answerMap = answers.stream()
                .collect(Collectors.toMap(
                        a -> a.getExamQuestion().getId(),
                        a -> a));

        int correct = 0;
        int wrong = 0;
        int unattempted = 0;

        BigDecimal obtained = BigDecimal.ZERO;
        BigDecimal negativeImpact = BigDecimal.ZERO;
        BigDecimal negativeMark = getNegativeMark(attempt);

        for (ExamQuestion q : questions) {

            AttemptAnswer ans = answerMap.get(q.getId());

            if (ans == null) {
                unattempted++;
                continue;
            }

            if (ans.getSelectedOption().equals(q.getCorrectOption())) {
                correct++;
                obtained = obtained.add(BigDecimal.valueOf(q.getMarks()));
            } else {
                wrong++;
                if (negativeMark.compareTo(BigDecimal.ZERO) > 0) {
                    obtained = obtained.subtract(negativeMark);
                    negativeImpact = negativeImpact.add(negativeMark);
                }
            }
        }

        if (obtained.compareTo(BigDecimal.ZERO) < 0) {
            obtained = BigDecimal.ZERO;
        }

        int totalQuestions = questions.size();

        double accuracy = (correct + wrong) > 0
                ? ((double) correct / (correct + wrong)) * 100
                : 0;

        return ResultDTO.builder()
                .totalQuestions(totalQuestions)
                .totalMarks(attempt.getExam().getTotalMarks().doubleValue())
                .obtainedMarks(obtained.doubleValue())
                .correctCount(correct)
                .wrongCount(wrong)
                .unattemptedCount(unattempted)
                .accuracyPercentage(accuracy)
                .negativeMarksImpact(negativeImpact.doubleValue())
                .submissionType(resolveSubmissionType(attempt))
                .build();
    }

    public List<AttemptAnswerDetailDTO> getAttemptAnswers(Long studentId, Long attemptId) {

        ExamAttempt attempt = getValidatedAttempt(studentId, attemptId);

        List<ExamQuestion> questions = getActiveQuestions(attempt);
        List<AttemptAnswer> answers = attemptAnswerRepository.findByAttemptId(attemptId);

        Map<Long, String> answerMap = answers.stream()
                .collect(Collectors.toMap(
                        a -> a.getExamQuestion().getId(),
                        AttemptAnswer::getSelectedOption));

        return questions.stream()
                .map(q -> buildAnswerDetail(q, answerMap.get(q.getId())))
                .collect(Collectors.toList());
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private ExamAttempt getValidatedAttempt(Long studentId, Long attemptId) {

        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));

        if (!attempt.getStudent().getId().equals(studentId)) {
            throw new InvalidActionException("You are not authorized to view this attempt.");
        }

        if (attempt.getStatus() == AttemptStatus.IN_PROGRESS) {
            throw new InvalidActionException("Results not available for in-progress attempts.");
        }

        return attempt;
    }

    private List<ExamQuestion> getActiveQuestions(ExamAttempt attempt) {
        return attempt.getExam().getExamSections().stream()
                .flatMap(section -> section.getSubSections().stream())
                .flatMap(subSection -> subSection.getQuestions().stream())
                .filter(q -> !q.isRemoved())
                .collect(Collectors.toList());
    }

    private BigDecimal getNegativeMark(ExamAttempt attempt) {
        BigDecimal neg = attempt.getExam().getNegativeMarks();
        return neg != null ? neg : BigDecimal.ZERO;
    }

    private SubmissionType resolveSubmissionType(ExamAttempt attempt) {
        return attempt.getStatus() == AttemptStatus.AUTO_SUBMITTED
                ? SubmissionType.AUTO
                : SubmissionType.MANUAL;
    }

    private AttemptAnswerDetailDTO buildAnswerDetail(ExamQuestion question,
            String selectedOption) {

        AnswerStatus status;
        int marksAwarded = 0;

        if (selectedOption == null) {
            status = AnswerStatus.UNATTEMPTED;
        } else if (selectedOption.equals(question.getCorrectOption())) {
            status = AnswerStatus.CORRECT;
            marksAwarded = question.getMarks();
        } else {
            status = AnswerStatus.WRONG;
        }

        List<OptionDTO> options = question.getOptions().stream()
                .map(opt -> OptionDTO.builder()
                        .id(opt)
                        .text(opt)
                        .build())
                .collect(Collectors.toList());

        return AttemptAnswerDetailDTO.builder()
                .questionId(question.getId())
                .questionText(question.getQuestionText())
                .options(options)
                .selectedOption(selectedOption)
                .correctOption(question.getCorrectOption())
                .marksAwarded(marksAwarded)
                .status(status)
                .build();
    }
}