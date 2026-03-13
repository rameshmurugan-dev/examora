package com.examora.backend.exam.service;

import com.examora.backend.common.exception.InvalidActionException;
import com.examora.backend.common.exception.ResourceNotFoundException;
import com.examora.backend.common.service.AuditService;
import com.examora.backend.exam.dto.ExamRequestDto;
import com.examora.backend.exam.dto.ExamResponseDto;
import com.examora.backend.exam.dto.ExamStructureResponseDto;
import com.examora.backend.exam.entity.*;
import com.examora.backend.exam.repository.*;
import com.examora.backend.questionbank.entity.DifficultyLevel;
import com.examora.backend.user.entity.User;
import com.examora.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Handles exam creation, structure management and lifecycle.
 */
@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final ExamSectionRepository examSectionRepository;
    private final ExamSubSectionRepository examSubSectionRepository;
    private final ExamQuestionRepository examQuestionRepository;

    private final UserRepository userRepository;

    private final AuditService auditService;

    @Transactional
    public ExamResponseDto createExam(ExamRequestDto request) {

        if (request.getDurationMinutes() <= 0) {
            throw new InvalidActionException("Duration must be greater than zero");
        }

        User admin = getCurrentUser();

        Exam exam = Exam.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .examMode(request.getExamMode())
                .durationMinutes(request.getDurationMinutes())
                .negativeMarks(request.getNegativeMarks())
                .status(ExamStatus.DRAFT)
                .createdBy(admin.getId())
                .build();

        Exam saved = examRepository.save(exam);

        auditService.log(
                "CREATE_EXAM",
                "Created exam: " + saved.getTitle(),
                saved.getId());

        return mapToResponse(saved);
    }

    // Validates complete structure and moves exam to PUBLISHED state
    @Transactional
    public ExamResponseDto publishExam(Long examId) {

        Exam exam = getDraftExam(examId);

        List<ExamSection> sections = examSectionRepository.findByExamId(examId);
        if (sections.isEmpty()) {
            throw new InvalidActionException("Exam must have at least one section");
        }

        for (ExamSection section : sections) {

            List<ExamSubSection> subSections = examSubSectionRepository.findByExamSectionId(section.getId());

            if (subSections.isEmpty()) {
                throw new InvalidActionException(
                        "Each section must contain at least one subsection");
            }

            for (ExamSubSection sub : subSections) {
                validateSubSectionBeforePublish(sub);
            }
        }

        int totalMarks = examQuestionRepository.calculateTotalMarks(examId);

        exam.setTotalMarks(totalMarks);
        exam.setStatus(ExamStatus.PUBLISHED);

        auditService.log(
                "PUBLISH_EXAM",
                "Published exam: " + exam.getTitle(),
                exam.getId());

        return mapToResponse(exam);
    }

    // Closes a published exam (no further attempts allowed)
    @Transactional
    public ExamResponseDto closeExam(Long examId) {

        Exam exam = getExam(examId);

        if (exam.getStatus() != ExamStatus.PUBLISHED) {
            throw new InvalidActionException(
                    "Only published exams can be closed");
        }

        exam.setStatus(ExamStatus.CLOSED);

        auditService.log(
                "CLOSE_EXAM",
                "Closed exam: " + exam.getTitle(),
                exam.getId());

        return mapToResponse(exam);
    }

    // Deletes exam permanently (only allowed in DRAFT)
    @Transactional
    public void deleteExam(Long examId) {

        Exam exam = getDraftExam(examId);

        examRepository.delete(exam);

        auditService.log(
                "DELETE_EXAM",
                "Deleted exam: " + exam.getTitle(),
                exam.getId());
    }

    // Returns all exams created by current admin
    @Transactional(readOnly = true)
    public List<ExamResponseDto> getMyExams() {

        User admin = getCurrentUser();

        return examRepository.findByCreatedBy(admin.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Returns full hierarchical structure of exam (Section → SubSection → Questions
    // summary)
    @Transactional(readOnly = true)
    public ExamStructureResponseDto getExamStructure(Long examId) {

        Exam exam = getExam(examId);

        List<ExamSection> sections = examSectionRepository.findDetailedByExamId(examId);

        List<ExamStructureResponseDto.SectionNode> sectionNodes = sections.stream()
                .map(section -> buildSectionNode(section))
                .toList();

        Integer totalMarks = calculateTotalMarks(exam);

        return ExamStructureResponseDto.builder()
                .examId(exam.getId())
                .title(exam.getTitle())
                .examMode(exam.getExamMode())
                .durationMinutes(exam.getDurationMinutes())
                .totalMarks(totalMarks)
                .negativeMarks(exam.getNegativeMarks())
                .sections(sectionNodes)
                .build();
    }

    // Maps ExamSection entity to response node
    private ExamStructureResponseDto.SectionNode buildSectionNode(ExamSection section) {

        List<ExamSubSection> subSections = examSubSectionRepository.findDetailedByExamSectionId(section.getId());

        List<ExamStructureResponseDto.SubSectionNode> subNodes = subSections.stream()
                .map(this::buildSubSectionNode)
                .toList();

        return ExamStructureResponseDto.SectionNode.builder()
                .examSectionId(section.getId())
                .sectionId(section.getSectionId())
                .title(section.getTitle())
                .subSections(subNodes)
                .build();
    }

    // Builds subsection node with derived question statistics
    private ExamStructureResponseDto.SubSectionNode buildSubSectionNode(ExamSubSection sub) {

        List<ExamQuestion> questions = sub.getQuestions(); // already fetched by EntityGraph

        int derivedCount = questions.size();

        List<ExamQuestion> activeQuestions = questions.stream()
                .filter(q -> !q.isRemoved())
                .toList();

        int activeCount = activeQuestions.size();

        int easyCount = (int) activeQuestions.stream()
                .filter(q -> q.getDifficultyLevel() == DifficultyLevel.EASY)
                .count();

        int mediumCount = (int) activeQuestions.stream()
                .filter(q -> q.getDifficultyLevel() == DifficultyLevel.MEDIUM)
                .count();

        int hardCount = (int) activeQuestions.stream()
                .filter(q -> q.getDifficultyLevel() == DifficultyLevel.HARD)
                .count();

        return ExamStructureResponseDto.SubSectionNode.builder()
                .examSubSectionId(sub.getId())
                .subSectionId(sub.getSubSectionId())
                .title(sub.getTitle())
                .derivedQuestionCount(derivedCount)
                .activeQuestionCount(activeCount)
                .questionLimit(sub.getQuestionLimit())
                .easyCount(easyCount)
                .mediumCount(mediumCount)
                .hardCount(hardCount)
                .build();
    }

    // Calculates total marks dynamically for DRAFT, else returns stored value
    private Integer calculateTotalMarks(Exam exam) {

        if (exam.getStatus() != ExamStatus.DRAFT) {
            return exam.getTotalMarks();
        }

        return examQuestionRepository.calculateTotalMarks(exam.getId());
    }

    // Fetches exam or throws 404
    private Exam getExam(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
    }

    // Ensures only DRAFT exams can be modified
    private Exam getDraftExam(Long id) {
        Exam exam = getExam(id);
        validateExamInDraft(exam);
        return exam;
    }

    private void validateExamInDraft(Exam exam) {
        if (exam.getStatus() != ExamStatus.DRAFT) {
            throw new InvalidActionException(
                    "Modifications allowed only in DRAFT status");
        }
    }

    // Ensures subsection satisfies publishing rules
    private void validateSubSectionBeforePublish(ExamSubSection sub) {

        if (sub.getQuestionLimit() == null || sub.getQuestionLimit() <= 0) {
            throw new InvalidActionException(
                    "Question limit not set for subsection: " + sub.getTitle());
        }

        List<ExamQuestion> questions = examQuestionRepository.findByExamSubSectionId(sub.getId());

        long activeCount = questions.stream()
                .filter(q -> !q.isRemoved())
                .count();

        if (sub.getSelectionMode() == SelectionMode.MANUAL) {

            if (activeCount < sub.getQuestionLimit()) {
                throw new InvalidActionException(
                        "Manual mode requires at least "
                                + sub.getQuestionLimit()
                                + " active questions in subsection: "
                                + sub.getTitle());
            }

        } else {

            if (questions.isEmpty()) {
                throw new InvalidActionException(
                        "Questions not generated for subsection: "
                                + sub.getTitle());
            }

            if (activeCount != sub.getQuestionLimit()) {
                throw new InvalidActionException(
                        "Generated question count mismatch in subsection: "
                                + sub.getTitle());
            }
        }
    }

    // Resolves currently authenticated user from security context
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    // Converts Exam entity to response DTO
    private ExamResponseDto mapToResponse(Exam exam) {
        return ExamResponseDto.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .examMode(exam.getExamMode())
                .durationMinutes(exam.getDurationMinutes())
                .totalMarks(exam.getTotalMarks())
                .negativeMarks(exam.getNegativeMarks())
                .status(exam.getStatus())
                .createdBy(exam.getCreatedBy())
                .createdAt(exam.getCreatedAt())
                .build();
    }

}