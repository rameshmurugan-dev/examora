package com.examora.backend.questionbank.service;

import com.examora.backend.common.exception.InvalidActionException;
import com.examora.backend.common.exception.ResourceNotFoundException;
import com.examora.backend.questionbank.dto.*;
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

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Production-grade Question Bank Service.
 *
 * Responsibilities:
 * - Strict validation
 * - Soft delete
 * - Duplicate protection
 * - Clean exception handling
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionBankService {

    private final SectionRepository sectionRepository;
    private final SubSectionRepository subSectionRepository;
    private final QuestionRepository questionRepository;

    // ============================================================
    // SECTIONS
    // ============================================================

    @Transactional
    public SectionResponse createSection(SectionRequest request) {

        String name = request.getName().trim();

        if (sectionRepository.existsByNameIgnoreCase(name)) {
            throw new InvalidActionException("Section already exists with name: " + name);
        }

        Section section = Section.builder()
                .name(name)
                .description(request.getDescription().trim())
                .build();

        return mapToSectionResponse(sectionRepository.save(section));
    }

    public List<SectionResponse> getAllSections() {
        return sectionRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::mapToSectionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SectionResponse updateSection(Long id, SectionRequest request) {

        Section section = findSection(id);
        String newName = request.getName().trim();

        if (sectionRepository.existsByNameIgnoreCaseAndIdNot(newName, id)) {
            throw new InvalidActionException("Another section already exists with name: " + newName);
        }

        section.setName(newName);
        section.setDescription(request.getDescription().trim());

        return mapToSectionResponse(section);
    }

    @Transactional
    public void deleteSection(Long id) {

        Section section = findSection(id);

        if (!subSectionRepository.findBySectionIdOrderByNameAsc(id).isEmpty()) {
            throw new InvalidActionException("Cannot delete section with existing subsections");
        }

        sectionRepository.delete(section);
    }

    private Section findSection(Long id) {
        return sectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));
    }

    // ============================================================
    // SUBSECTIONS
    // ============================================================

    @Transactional
    public SubSectionResponse createSubSection(Long sectionId, SubSectionRequest request) {

        Section section = findSection(sectionId);
        String name = request.getName().trim();

        if (subSectionRepository.existsBySectionIdAndNameIgnoreCase(sectionId, name)) {
            throw new InvalidActionException("SubSection already exists in this section");
        }

        SubSection subSection = SubSection.builder()
                .name(name)
                .section(section)
                .build();

        return mapToSubSectionResponse(subSectionRepository.save(subSection));
    }

    public List<SubSectionResponse> getSubSectionsBySectionId(Long sectionId) {

        if (!sectionRepository.existsById(sectionId)) {
            throw new ResourceNotFoundException("Section not found");
        }

        return subSectionRepository.findBySectionIdOrderByNameAsc(sectionId)
                .stream()
                .map(this::mapToSubSectionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubSectionResponse updateSubSection(Long id, SubSectionRequest request) {

        SubSection subSection = findSubSection(id);
        String name = request.getName().trim();

        if (subSectionRepository.existsBySectionIdAndNameIgnoreCaseAndIdNot(
                subSection.getSection().getId(), name, id)) {
            throw new InvalidActionException("Duplicate subsection name in same section");
        }

        subSection.setName(name);
        return mapToSubSectionResponse(subSection);
    }

    @Transactional
    public void deleteSubSection(Long id) {

        SubSection subSection = findSubSection(id);

        if (!questionRepository.findBySubSectionIdAndActiveTrue(id).isEmpty()) {
            throw new InvalidActionException("Cannot delete subsection with active questions");
        }

        subSectionRepository.delete(subSection);
    }

    private SubSection findSubSection(Long id) {
        return subSectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubSection not found"));
    }

    // ============================================================
    // QUESTIONS
    // ============================================================

    @Transactional
    public QuestionResponse createQuestion(Long subSectionId, QuestionRequest request) {

        SubSection subSection = findSubSection(subSectionId);
        validateQuestionRequest(request);

        if (questionRepository
                .existsByQuestionTextIgnoreCaseAndSubSectionIdAndActiveTrue(
                        request.getQuestionText().trim(), subSectionId)) {

            throw new InvalidActionException("Duplicate question in this subsection");
        }

        Question question = Question.builder()
                .questionText(request.getQuestionText().trim())
                .options(request.getOptions().stream().map(String::trim).toList())
                .correctOption(request.getCorrectOption().trim())
                .marks(request.getMarks())
                .difficultyLevel(request.getDifficultyLevel())
                .subSection(subSection)
                .build();

        return mapToQuestionResponse(questionRepository.save(question));
    }

    public Page<QuestionResponse> getQuestionsBySubSectionId(Long subSectionId, Pageable pageable) {

        if (!subSectionRepository.existsById(subSectionId)) {
            throw new ResourceNotFoundException("SubSection not found");
        }

        return questionRepository
                .findBySubSectionIdAndActiveTrue(subSectionId, pageable)
                .map(this::mapToQuestionResponse);
    }

    @Transactional
    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {

        Question question = findActiveQuestion(id);
        validateQuestionRequest(request);

        if (questionRepository
                .existsByQuestionTextIgnoreCaseAndSubSectionIdAndActiveTrue(
                        request.getQuestionText().trim(),
                        question.getSubSection().getId())
                && !question.getQuestionText().equalsIgnoreCase(request.getQuestionText().trim())) {

            throw new InvalidActionException("Duplicate question in this subsection");
        }

        question.setQuestionText(request.getQuestionText().trim());
        question.setOptions(request.getOptions().stream().map(String::trim).toList());
        question.setCorrectOption(request.getCorrectOption().trim());
        question.setMarks(request.getMarks());
        question.setDifficultyLevel(request.getDifficultyLevel());

        return mapToQuestionResponse(question);
    }

    @Transactional
    public void deleteQuestion(Long id) {

        Question question = findActiveQuestion(id);

        // SOFT DELETE
        question.setActive(false);
    }

    private Question findActiveQuestion(Long id) {
        return questionRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
    }

    // ============================================================
    // VALIDATION
    // ============================================================

    private void validateQuestionRequest(QuestionRequest request) {

        List<String> trimmedOptions = request.getOptions()
                .stream()
                .map(String::trim)
                .toList();

        if (trimmedOptions.stream().anyMatch(String::isBlank)) {
            throw new InvalidActionException("Options cannot contain blank values");
        }

        Set<String> unique = new HashSet<>(trimmedOptions);
        if (unique.size() != trimmedOptions.size()) {
            throw new InvalidActionException("Options must be unique");
        }

        if (!unique.contains(request.getCorrectOption().trim())) {
            throw new InvalidActionException("Correct option must match one of the options");
        }

        if (request.getMarks() <= 0) {
            throw new InvalidActionException("Marks must be greater than zero");
        }
    }

    // ============================================================
    // MAPPERS
    // ============================================================

    private SectionResponse mapToSectionResponse(Section s) {
        return SectionResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .description(s.getDescription())
                .createdAt(s.getCreatedAt())
                .build();
    }

    private SubSectionResponse mapToSubSectionResponse(SubSection ss) {
        return SubSectionResponse.builder()
                .id(ss.getId())
                .name(ss.getName())
                .sectionId(ss.getSection().getId())
                .sectionName(ss.getSection().getName())
                .createdAt(ss.getCreatedAt())
                .build();
    }

    private QuestionResponse mapToQuestionResponse(Question q) {
        return QuestionResponse.builder()
                .id(q.getId())
                .questionText(q.getQuestionText())
                .options(q.getOptions())
                .correctOption(q.getCorrectOption())
                .marks(q.getMarks())
                .difficultyLevel(q.getDifficultyLevel())
                .subSectionId(q.getSubSection().getId())
                .subSectionName(q.getSubSection().getName())
                .createdAt(q.getCreatedAt())
                .build();
    }
}