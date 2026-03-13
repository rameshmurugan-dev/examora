package com.examora.backend.attempt.service;

import com.examora.backend.attempt.dto.AttemptQuestionDTO;
import com.examora.backend.attempt.dto.ExamAttemptResponse;
import com.examora.backend.attempt.dto.OptionDTO;
import com.examora.backend.attempt.dto.SaveAnswerRequest;
import com.examora.backend.attempt.entity.AttemptAnswer;
import com.examora.backend.attempt.entity.AttemptStatus;
import com.examora.backend.attempt.entity.ExamAttempt;
import com.examora.backend.attempt.repository.AttemptAnswerRepository;
import com.examora.backend.attempt.repository.ExamAttemptRepository;
import com.examora.backend.common.exception.InvalidActionException;
import com.examora.backend.common.exception.ResourceNotFoundException;
import com.examora.backend.common.exception.UnauthorizedException;
import com.examora.backend.common.service.AuditService;
import com.examora.backend.exam.entity.Exam;
import com.examora.backend.exam.entity.ExamQuestion;
import com.examora.backend.exam.entity.ExamStatus;
import com.examora.backend.exam.repository.ExamQuestionRepository;
import com.examora.backend.exam.repository.ExamRepository;
import com.examora.backend.user.entity.User;
import com.examora.backend.user.repository.UserRepository;

import java.util.Objects;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
import org.springframework.stereotype.Service;
import java.util.UUID;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Handles complete lifecycle of student exam attempts.
 *
 * Responsibilities:
 * - Enforce single attempt rule
 * - Enforce strict timer
 * - Save answers safely
 * - Prevent unauthorized access
 * - Ensure idempotent submission
 *
 * Layer: Service
 */
@Service
@RequiredArgsConstructor
public class ExamAttemptService {

    private final ExamAttemptRepository attemptRepository;
    private final AttemptAnswerRepository answerRepository;
    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    // ============================================================
    // START / RESUME ATTEMPT
    // ============================================================

    @Transactional
    public ExamAttemptResponse startAttempt(Long userId, Long examId) {

        User student = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        String sessionToken = UUID.randomUUID().toString();

        if (exam.getStatus() != ExamStatus.PUBLISHED) {
            throw new InvalidActionException("Exam is not currently available.");
        }

        // Enforce single attempt per exam per student
        Optional<ExamAttempt> existingAttempt = attemptRepository.findByExam_IdAndStudent_Id(examId, userId);

        if (existingAttempt.isPresent()) {

            ExamAttempt existing = existingAttempt.get();

            enforceTimer(existing);

            if (existing.getStatus() == AttemptStatus.IN_PROGRESS) {
                return mapToResponse(existing);
            }

            // Idempotent behavior
            return mapToResponse(existing);
        }

        LocalDateTime now = LocalDateTime.now();

        ExamAttempt attempt = ExamAttempt.builder()
                .exam(exam)
                .student(student)
                .startedAt(now)
                .expiresAt(now.plusMinutes(exam.getDurationMinutes()))
                .status(AttemptStatus.IN_PROGRESS)
                .sessionToken(sessionToken)
                .build();

        attemptRepository.save(attempt);

        auditService.log(
                "START_EXAM",
                "Student started exam: " + exam.getTitle(),
                exam.getId());

        return mapToResponse(attempt);
    }

    // ============================================================
    // GET ATTEMPT METADATA
    // ============================================================

    @Transactional
    public ExamAttemptResponse getAttempt(Long userId, Long attemptId) {

        ExamAttempt attempt = getOwnedAttempt(userId, attemptId);

        enforceTimer(attempt);

        return mapToResponse(attempt);
    }

    // ============================================================
    // FETCH QUESTIONS
    // ============================================================

    @Transactional
    public List<AttemptQuestionDTO> getAttemptQuestions(Long userId, Long attemptId) {

        ExamAttempt attempt = getOwnedAttempt(userId, attemptId);

        enforceTimer(attempt);

        List<ExamQuestion> questions = examQuestionRepository
                .findByExamSubSection_ExamSection_Exam_IdAndIsRemovedFalseOrderByIdAsc(
                        attempt.getExam().getId());

        List<AttemptAnswer> answers = answerRepository.findByAttemptId(attemptId);

        Map<Long, String> savedAnswers = answers.stream()
                .collect(Collectors.toMap(
                        a -> a.getExamQuestion().getId(),
                        AttemptAnswer::getSelectedOption));

        return questions.stream().map(q -> {

            List<OptionDTO> optionDTOs = q.getOptions().stream()
                    .map(opt -> OptionDTO.builder()
                            .id(opt)
                            .text(opt)
                            .build())
                    .collect(Collectors.toList());

            return AttemptQuestionDTO.builder()
                    .questionId(q.getId())
                    .questionText(q.getQuestionText())
                    .options(optionDTOs)
                    .marks(q.getMarks())
                    .questionType("MCQ")
                    .savedOption(savedAnswers.get(q.getId()))
                    .build();
        }).collect(Collectors.toList());
    }

    // ============================================================
    // SAVE ANSWER
    // ============================================================

    @Transactional
    public void saveAnswer(Long userId, Long attemptId, String token, SaveAnswerRequest request) {

        ExamAttempt attempt = getOwnedAttempt(userId, attemptId);

        enforceTimer(attempt);

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new InvalidActionException("Cannot modify a submitted or expired attempt.");
        }

        ExamQuestion question = examQuestionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (question.isRemoved()) {
            throw new InvalidActionException(
                    "This question is no longer active in the exam");
        }

        // Validate question belongs to exam
        if (!question.getExamSubSection()
                .getExamSection()
                .getExam()
                .getId()
                .equals(attempt.getExam().getId())) {

            throw new InvalidActionException("Question does not belong to this exam.");
        }

        // Validate selected option
        if (!question.getOptions().contains(request.getSelectedOption())) {
            throw new InvalidActionException("Invalid option selected.");
        }

        // Validate session token
        if (!Objects.equals(attempt.getSessionToken(), token)) {
            throw new UnauthorizedException("Invalid attempt session");
        }

        enforceTimer(attempt);

        AttemptAnswer answer = answerRepository
                .findByAttemptIdAndExamQuestionId(attemptId, request.getQuestionId())
                .orElse(
                        AttemptAnswer.builder()
                                .attempt(attempt)
                                .examQuestion(question)
                                .build());

        answer.setSelectedOption(request.getSelectedOption());
        answer.setSavedAt(LocalDateTime.now());

        answerRepository.save(answer);
    }

    // ============================================================
    // SUBMIT ATTEMPT (IDEMPOTENT)
    // ============================================================

    @Transactional
    public ExamAttemptResponse submitAttempt(Long userId, Long attemptId) {

        ExamAttempt attempt = getOwnedAttempt(userId, attemptId);

        enforceTimer(attempt);

        if (attempt.getStatus() == AttemptStatus.SUBMITTED
                || attempt.getStatus() == AttemptStatus.AUTO_SUBMITTED) {

            // Idempotent behavior
            return mapToResponse(attempt);
        }

        attempt.setStatus(AttemptStatus.SUBMITTED);
        attempt.setSubmittedAt(LocalDateTime.now());

        attemptRepository.save(attempt);

        auditService.log(
                "SUBMIT_EXAM",
                "Student submitted exam: " + attempt.getExam().getTitle(),
                attempt.getId());

        return mapToResponse(attempt);
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private ExamAttempt getOwnedAttempt(Long userId, Long attemptId) {

        ExamAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));

        if (!attempt.getStudent().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to access this attempt.");
        }

        return attempt;
    }

    /**
     * Enforces strict timer.
     * If expired and still IN_PROGRESS → auto submit.
     */
    private void enforceTimer(ExamAttempt attempt) {

        if (attempt.getStatus() == AttemptStatus.IN_PROGRESS
                && LocalDateTime.now().isAfter(attempt.getExpiresAt())) {

            attempt.setStatus(AttemptStatus.AUTO_SUBMITTED);
            attempt.setSubmittedAt(attempt.getExpiresAt());

            attemptRepository.save(attempt);

            auditService.log(
                    "AUTO_SUBMIT",
                    "Attempt auto-submitted due to timeout.",
                    attempt.getId());
        }
    }

    private ExamAttemptResponse mapToResponse(ExamAttempt attempt) {
        return ExamAttemptResponse.builder()
                .id(attempt.getId())
                .examId(attempt.getExam().getId())
                .examTitle(attempt.getExam().getTitle())
                .durationMinutes(attempt.getExam().getDurationMinutes())
                .startedAt(attempt.getStartedAt())
                .expiresAt(attempt.getExpiresAt())
                .submittedAt(attempt.getSubmittedAt())
                .status(attempt.getStatus())
                .sessionToken(attempt.getSessionToken())
                .serverTime(LocalDateTime.now())
                .build();
    }
}