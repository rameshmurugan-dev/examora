package com.examora.backend.exam.service;

import com.examora.backend.common.exception.InvalidActionException;
import com.examora.backend.common.exception.ResourceNotFoundException;
import com.examora.backend.exam.dto.*;
import com.examora.backend.exam.entity.*;
import com.examora.backend.exam.repository.*;
import com.examora.backend.questionbank.entity.DifficultyLevel;
import com.examora.backend.questionbank.entity.Question;
import com.examora.backend.questionbank.entity.Section;
import com.examora.backend.questionbank.entity.SubSection;
import com.examora.backend.questionbank.repository.QuestionRepository;
import com.examora.backend.questionbank.repository.SectionRepository;
import com.examora.backend.questionbank.repository.SubSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ExamStructureService {

    private final ExamRepository examRepository;
    private final ExamSectionRepository examSectionRepository;
    private final ExamSubSectionRepository examSubSectionRepository;
    private final ExamQuestionRepository examQuestionRepository;

    private final SectionRepository sectionRepository;
    private final SubSectionRepository subSectionRepository;
    private final QuestionRepository questionRepository;

    /*
     * ============================================================
     * SECTION MANAGEMENT
     * ============================================================
     */

    @Transactional
    public void addSection(Long examId, Long sectionId) {

        Exam exam = getDraftExam(examId);

        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

        if (examSectionRepository.findByExamIdAndSectionId(examId, sectionId).isPresent()) {
            throw new InvalidActionException("Section already added to this exam");
        }

        examSectionRepository.save(
                ExamSection.builder()
                        .exam(exam)
                        .sectionId(section.getId())
                        .title(section.getName())
                        .build());
    }

    @Transactional
    public void removeSection(Long examId, Long sectionId) {

        getDraftExam(examId);

        ExamSection examSection = examSectionRepository
                .findByExamIdAndSectionId(examId, sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found in exam"));

        examSectionRepository.delete(examSection);
    }

    /*
     * ============================================================
     * SUBSECTION MANAGEMENT
     * ============================================================
     */

    @Transactional
    public void addSubSection(Long examId, Long sectionId, Long subSectionId) {

        getDraftExam(examId);

        ExamSection examSection = examSectionRepository
                .findByExamIdAndSectionId(examId, sectionId)
                .orElseThrow(() -> new InvalidActionException("Section must be added before subsection"));

        SubSection subSection = subSectionRepository.findById(subSectionId)
                .orElseThrow(() -> new ResourceNotFoundException("SubSection not found"));

        if (!subSection.getSection().getId().equals(sectionId)) {
            throw new InvalidActionException("SubSection does not belong to Section");
        }

        if (examSubSectionRepository
                .findByExamSectionIdAndSubSectionId(examSection.getId(), subSectionId)
                .isPresent()) {
            throw new InvalidActionException("SubSection already added");
        }

        examSubSectionRepository.save(
                ExamSubSection.builder()
                        .examSection(examSection)
                        .subSectionId(subSection.getId())
                        .title(subSection.getName())
                        .selectionMode(SelectionMode.MANUAL)
                        .shuffleQuestions(false)
                        .build());
    }

    @Transactional
    public void removeSubSection(Long examId, Long examSubSectionId) {

        getDraftExam(examId);

        ExamSubSection sub = examSubSectionRepository.findById(examSubSectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam SubSection not found"));

        if (!sub.getExamSection().getExam().getId().equals(examId)) {
            throw new InvalidActionException("SubSection does not belong to this exam");
        }

        examSubSectionRepository.delete(sub);
    }

    @Transactional(readOnly = true)
    public ExamSubSectionResponseDto getExamSubSection(Long examSubSectionId) {

        ExamSubSection sub = examSubSectionRepository.findById(examSubSectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam SubSection not found"));

        int total = sub.getQuestions().size();
        int active = (int) sub.getQuestions().stream().filter(q -> !q.isRemoved()).count();

        return ExamSubSectionResponseDto.builder()
                .id(sub.getId())
                .subSectionId(sub.getSubSectionId())
                .title(sub.getTitle())
                .questionLimit(sub.getQuestionLimit())
                .selectionMode(sub.getSelectionMode())
                .easyPercentage(sub.getEasyPercentage())
                .mediumPercentage(sub.getMediumPercentage())
                .hardPercentage(sub.getHardPercentage())
                .shuffleQuestions(sub.getShuffleQuestions())
                .totalQuestions(total)
                .activeQuestions(active)
                .build();
    }

    /*
     * ============================================================
     * SUBSECTION CONFIGURATION
     * ============================================================
     */

    @Transactional
    public void updateSubSectionSettings(Long examSubSectionId,
            ExamSubSectionSettingsRequest request) {

        ExamSubSection sub = examSubSectionRepository.findById(examSubSectionId)
                .orElseThrow(() -> new ResourceNotFoundException("SubSection not found"));

        validateDraft(sub.getExamSection().getExam());
        validateSettingsRequest(request);

        sub.setSelectionMode(request.getSelectionMode());
        sub.setQuestionLimit(request.getQuestionLimit());
        sub.setShuffleQuestions(Boolean.TRUE.equals(request.getShuffleQuestions()));

        if (request.getSelectionMode() == SelectionMode.SMART) {
            sub.setEasyPercentage(request.getEasyPercentage());
            sub.setMediumPercentage(request.getMediumPercentage());
            sub.setHardPercentage(request.getHardPercentage());
        } else {
            sub.setEasyPercentage(null);
            sub.setMediumPercentage(null);
            sub.setHardPercentage(null);
        }
    }

    @Transactional
    public void updateQuestionLimit(Long examId,
            Long examSubSectionId,
            Integer limit) {

        if (limit == null || limit <= 0) {
            throw new InvalidActionException("Question limit must be positive");
        }

        getDraftExam(examId);

        ExamSubSection sub = examSubSectionRepository.findById(examSubSectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam SubSection not found"));

        if (!sub.getExamSection().getExam().getId().equals(examId)) {
            throw new InvalidActionException("SubSection does not belong to this exam");
        }

        List<ExamQuestion> questions = examQuestionRepository.findByExamSubSectionId(sub.getId());

        if (limit > questions.size()) {
            throw new InvalidActionException(
                    "Limit exceeds derived questions (" + questions.size() + ")");
        }

        sub.setQuestionLimit(limit);

        int activeCounter = 0;
        for (ExamQuestion q : questions) {
            if (!q.isRemoved()) {
                activeCounter++;
                q.setRemoved(activeCounter > limit);
            }
        }
    }

    /*
     * ============================================================
     * QUESTION MANAGEMENT
     * ============================================================
     */

    @Transactional
    public void updateQuestion(Long examId,
            Long examQuestionId,
            ExamQuestionDto request) {

        getDraftExam(examId);

        ExamQuestion question = examQuestionRepository.findById(examQuestionId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam Question not found"));

        validateQuestionOwnership(question, examId);

        if (!request.getOptions().contains(request.getCorrectOption())) {
            throw new InvalidActionException("Correct option must match one of the options");
        }

        question.setQuestionText(request.getQuestionText());
        question.setOptions(request.getOptions());
        question.setCorrectOption(request.getCorrectOption());
        question.setMarks(request.getMarks());
    }

    @Transactional
    public void addQuestionFromBank(Long examId, Long originalQuestionId) {

        getDraftExam(examId);

        Question original = questionRepository.findById(originalQuestionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found in Question Bank"));

        Long sectionId = original.getSubSection().getSection().getId();
        Long subSectionId = original.getSubSection().getId();

        ExamSection examSection = examSectionRepository
                .findByExamIdAndSectionId(examId, sectionId)
                .orElseThrow(() -> new InvalidActionException("Section not included in this exam"));

        ExamSubSection examSubSection = examSubSectionRepository
                .findByExamSectionIdAndSubSectionId(examSection.getId(), subSectionId)
                .orElseThrow(() -> new InvalidActionException("SubSection not included in this exam"));

        if (examQuestionRepository.existsByExamSubSectionIdAndOriginalQuestionId(
                examSubSection.getId(), originalQuestionId)) {
            throw new InvalidActionException("Question already exists in this exam");
        }

        examQuestionRepository.save(
                ExamQuestion.builder()
                        .examSubSection(examSubSection)
                        .originalQuestionId(original.getId())
                        .questionText(original.getQuestionText())
                        .options(new ArrayList<>(original.getOptions()))
                        .correctOption(original.getCorrectOption())
                        .marks(original.getMarks())
                        .difficultyLevel(original.getDifficultyLevel())
                        .isRemoved(false)
                        .build());
    }

    @Transactional(readOnly = true)
    public Page<ExamQuestionDto> getQuestionsBySubSection(Long examSubSectionId,
            Pageable pageable) {

        return examQuestionRepository
                .findWithSubSectionByExamSubSectionId(examSubSectionId, pageable)
                .map(q -> ExamQuestionDto.builder()
                        .id(q.getId())
                        .originalQuestionId(q.getOriginalQuestionId())
                        .originalSubSectionId(q.getExamSubSection().getSubSectionId())
                        .questionText(q.getQuestionText())
                        .options(q.getOptions())
                        .correctOption(q.getCorrectOption())
                        .marks(q.getMarks())
                        .isRemoved(q.isRemoved())
                        .build());
    }

    @Transactional
    public void toggleQuestionRemoval(Long examQuestionId, boolean removed) {

        ExamQuestion question = examQuestionRepository.findById(examQuestionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        ExamSubSection sub = question.getExamSubSection();
        validateDraft(sub.getExamSection().getExam());

        // prevent enabling beyond limit
        if (!removed) {
            long activeCount = examQuestionRepository.countActiveBySubSection(sub.getId());
            if (sub.getQuestionLimit() != null && activeCount >= sub.getQuestionLimit()) {
                throw new InvalidActionException("Question limit exceeded");
            }
        }

        // prevent removing all questions
        if (removed) {

            long activeCount = examQuestionRepository.countActiveBySubSection(sub.getId());

            if (activeCount <= 1) {
                throw new InvalidActionException(
                        "Cannot remove this question. Subsection must contain at least one active question.");
            }
        }

        question.setRemoved(removed);
    }

    /*
     * ============================================================
     * QUESTION GENERATION
     * ============================================================
     */

    @Transactional
    public void generateQuestionsForSubSection(Long examSubSectionId) {

        ExamSubSection sub = examSubSectionRepository.findById(examSubSectionId)
                .orElseThrow(() -> new ResourceNotFoundException("SubSection not found"));

        validateDraft(sub.getExamSection().getExam());

        if (sub.getQuestionLimit() == null || sub.getQuestionLimit() <= 0) {
            throw new InvalidActionException("Question limit not configured");
        }

        examQuestionRepository.deleteByExamSubSectionId(examSubSectionId);

        List<Question> bankQuestions = questionRepository.findBySubSectionIdAndActiveTrue(sub.getSubSectionId());

        if (bankQuestions.isEmpty()) {
            throw new InvalidActionException("No questions available in question bank");
        }

        List<Question> selected = switch (sub.getSelectionMode()) {
            case RANDOM -> generateRandom(bankQuestions, sub.getQuestionLimit());
            case SMART -> generateSmart(bankQuestions, sub);
            case MANUAL -> throw new InvalidActionException("Manual mode does not support auto-generation");
        };

        if (Boolean.TRUE.equals(sub.getShuffleQuestions())) {
            Collections.shuffle(selected);
        }

        saveDerivedQuestions(sub, selected);
    }

    private List<Question> generateRandom(List<Question> pool, int limit) {

        if (limit > pool.size()) {
            throw new InvalidActionException("Limit exceeds available questions");
        }

        List<Question> copy = new ArrayList<>(pool);
        Collections.shuffle(copy);

        return copy.stream().limit(limit).toList();
    }

    private List<Question> generateSmart(List<Question> pool,
            ExamSubSection sub) {

        int limit = sub.getQuestionLimit();

        int easyCount = (limit * sub.getEasyPercentage()) / 100;
        int mediumCount = (limit * sub.getMediumPercentage()) / 100;
        int hardCount = limit - easyCount - mediumCount;

        List<Question> result = new ArrayList<>();
        result.addAll(pickRandom(filter(pool, DifficultyLevel.EASY), easyCount));
        result.addAll(pickRandom(filter(pool, DifficultyLevel.MEDIUM), mediumCount));
        result.addAll(pickRandom(filter(pool, DifficultyLevel.HARD), hardCount));

        if (result.size() != limit) {
            throw new InvalidActionException("Difficulty distribution mismatch");
        }

        return result;
    }

    private List<Question> filter(List<Question> pool, DifficultyLevel level) {
        return pool.stream().filter(q -> q.getDifficultyLevel() == level).toList();
    }

    private List<Question> pickRandom(List<Question> pool, int count) {

        if (count == 0)
            return List.of();

        if (pool.size() < count) {
            throw new InvalidActionException("Insufficient questions for difficulty level");
        }

        List<Question> copy = new ArrayList<>(pool);
        Collections.shuffle(copy);

        return copy.stream().limit(count).toList();
    }

    private void saveDerivedQuestions(ExamSubSection sub,
            List<Question> selected) {

        List<ExamQuestion> derived = selected.stream()
                .map(q -> ExamQuestion.builder()
                        .examSubSection(sub)
                        .originalQuestionId(q.getId())
                        .questionText(q.getQuestionText())
                        .options(new ArrayList<>(q.getOptions()))
                        .correctOption(q.getCorrectOption())
                        .marks(q.getMarks())
                        .difficultyLevel(q.getDifficultyLevel())
                        .isRemoved(false)
                        .build())
                .toList();

        examQuestionRepository.saveAll(derived);
    }

    /*
     * ============================================================
     * INTERNAL VALIDATION
     * ============================================================
     */

    private Exam getDraftExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        validateDraft(exam);
        return exam;
    }

    private void validateDraft(Exam exam) {
        if (exam.getStatus() != ExamStatus.DRAFT) {
            throw new InvalidActionException("Modifications allowed only in DRAFT status");
        }
    }

    private void validateSettingsRequest(ExamSubSectionSettingsRequest request) {

        if (request.getQuestionLimit() != null && request.getQuestionLimit() <= 0) {
            throw new InvalidActionException("Question limit must be positive");
        }

        if (request.getSelectionMode() == SelectionMode.SMART) {

            if (request.getEasyPercentage() == null ||
                    request.getMediumPercentage() == null ||
                    request.getHardPercentage() == null) {
                throw new InvalidActionException("All difficulty percentages required for SMART mode");
            }

            int total = request.getEasyPercentage()
                    + request.getMediumPercentage()
                    + request.getHardPercentage();

            if (total != 100) {
                throw new InvalidActionException("Difficulty percentages must total 100%");
            }
        }
    }

    private void validateQuestionOwnership(ExamQuestion question, Long examId) {

        if (!question.getExamSubSection()
                .getExamSection()
                .getExam()
                .getId()
                .equals(examId)) {
            throw new InvalidActionException("Question does not belong to this exam");
        }
    }
}