package com.examora.backend.exam.controller;

import com.examora.backend.common.response.ApiResponse;
import com.examora.backend.exam.dto.*;
import com.examora.backend.exam.service.ExamService;
import com.examora.backend.exam.service.ExamStructureService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin controller for managing exams.
 * Handles exam lifecycle and structure operations.
 */
@RestController
@RequestMapping("/admin/exams")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ExamController {

        private final ExamService examService;
        private final ExamStructureService examStructureService;

        /*
         * ============================================================
         * EXAM CREATION & LIFECYCLE
         * ============================================================
         */

        // Create new exam (DRAFT)
        @PostMapping
        public ResponseEntity<ApiResponse<ExamResponseDto>> createExam(
                        @Valid @RequestBody ExamRequestDto request) {

                ExamResponseDto exam = examService.createExam(request);

                return ResponseEntity.ok(
                                ApiResponse.success("Exam created successfully", exam));
        }

        // Publish exam
        @PostMapping("/{examId}/publish")
        public ResponseEntity<ApiResponse<ExamResponseDto>> publishExam(
                        @PathVariable Long examId) {

                ExamResponseDto exam = examService.publishExam(examId);

                return ResponseEntity.ok(
                                ApiResponse.success("Exam published successfully", exam));
        }

        // Close exam
        @PostMapping("/{examId}/close")
        public ResponseEntity<ApiResponse<ExamResponseDto>> closeExam(
                        @PathVariable Long examId) {

                ExamResponseDto exam = examService.closeExam(examId);

                return ResponseEntity.ok(
                                ApiResponse.success("Exam closed successfully", exam));
        }

        // Delete draft exam
        @DeleteMapping("/{examId}")
        public ResponseEntity<ApiResponse<Void>> deleteExam(
                        @PathVariable Long examId) {

                examService.deleteExam(examId);

                return ResponseEntity.ok(
                                ApiResponse.success("Exam deleted successfully", null));
        }

        /*
         * ============================================================
         * SECTION MANAGEMENT
         * ============================================================
         */

        @PostMapping("/{examId}/sections/{sectionId}")
        public ResponseEntity<ApiResponse<Void>> addSection(
                        @PathVariable Long examId,
                        @PathVariable Long sectionId) {

                examStructureService.addSection(examId, sectionId);

                return ResponseEntity.ok(
                                ApiResponse.success("Section added to exam", null));
        }

        @DeleteMapping("/{examId}/sections/{sectionId}")
        public ResponseEntity<ApiResponse<Void>> removeSection(
                        @PathVariable Long examId,
                        @PathVariable Long sectionId) {

                examStructureService.removeSection(examId, sectionId);

                return ResponseEntity.ok(
                                ApiResponse.success("Section removed from exam", null));
        }

        /*
         * ============================================================
         * SUBSECTION MANAGEMENT
         * ============================================================
         */

        @PostMapping("/{examId}/sections/{sectionId}/subsections/{subSectionId}")
        public ResponseEntity<ApiResponse<Void>> addSubSection(
                        @PathVariable Long examId,
                        @PathVariable Long sectionId,
                        @PathVariable Long subSectionId) {

                examStructureService.addSubSection(examId, sectionId, subSectionId);

                return ResponseEntity.ok(
                                ApiResponse.success("SubSection added successfully", null));
        }

        @DeleteMapping("/{examId}/subsections/{examSubSectionId}")
        public ResponseEntity<ApiResponse<Void>> removeSubSection(
                        @PathVariable Long examId,
                        @PathVariable Long examSubSectionId) {

                examStructureService.removeSubSection(examId, examSubSectionId);

                return ResponseEntity.ok(
                                ApiResponse.success("SubSection removed from exam", null));
        }

        @GetMapping("/subsections/{examSubSectionId}")
        public ResponseEntity<ApiResponse<ExamSubSectionResponseDto>> getSubSection(
                        @PathVariable Long examSubSectionId) {

                ExamSubSectionResponseDto sub = examStructureService.getExamSubSection(examSubSectionId);

                return ResponseEntity.ok(
                                ApiResponse.success("SubSection fetched successfully", sub));
        }

        /*
         * ============================================================
         * QUESTION MANAGEMENT
         * ============================================================
         */

        @PutMapping("/{examId}/questions/{examQuestionId}")
        public ResponseEntity<ApiResponse<Void>> updateQuestion(
                        @PathVariable Long examId,
                        @PathVariable Long examQuestionId,
                        @Valid @RequestBody ExamQuestionDto request) {

                examStructureService.updateQuestion(examId, examQuestionId, request);

                return ResponseEntity.ok(
                                ApiResponse.success("Question updated successfully", null));
        }

        @PatchMapping("/questions/{examQuestionId}")
        public ResponseEntity<ApiResponse<Void>> toggleQuestionRemoval(
                        @PathVariable Long examQuestionId,
                        @Valid @RequestBody RemoveQuestionRequest request) {

                examStructureService.toggleQuestionRemoval(
                                examQuestionId,
                                request.isRemoved());

                return ResponseEntity.ok(
                                ApiResponse.success("Question status updated successfully", null));
        }

        @PostMapping("/{examId}/questions/add-from-bank")
        public ResponseEntity<ApiResponse<Void>> addQuestionFromBank(
                        @PathVariable Long examId,
                        @RequestParam Long originalQuestionId) {

                examStructureService.addQuestionFromBank(examId, originalQuestionId);

                return ResponseEntity.ok(
                                ApiResponse.success("Question added from question bank", null));
        }

        @GetMapping("/questions/by-subsection/{examSubSectionId}")
        public ResponseEntity<ApiResponse<Page<ExamQuestionDto>>> getQuestionsBySubSection(
                        @PathVariable Long examSubSectionId,
                        Pageable pageable) {

                Page<ExamQuestionDto> page = examStructureService.getQuestionsBySubSection(examSubSectionId, pageable);

                return ResponseEntity.ok(
                                ApiResponse.success("Questions fetched successfully", page));
        }

        /*
         * ============================================================
         * SUBSECTION CONFIGURATION
         * ============================================================
         */

        @PutMapping("/{examId}/subsections/{subSectionId}/limit")
        public ResponseEntity<ApiResponse<Void>> updateQuestionLimit(
                        @PathVariable Long examId,
                        @PathVariable Long subSectionId,
                        @Valid @RequestBody QuestionLimitDto request) {

                examStructureService.updateQuestionLimit(
                                examId,
                                subSectionId,
                                request.getQuestionLimit());

                return ResponseEntity.ok(
                                ApiResponse.success("Question limit updated successfully", null));
        }

        @PutMapping("/subsections/{examSubSectionId}/settings")
        public ResponseEntity<ApiResponse<Void>> updateSubSectionSettings(
                        @PathVariable Long examSubSectionId,
                        @Valid @RequestBody ExamSubSectionSettingsRequest request) {

                examStructureService.updateSubSectionSettings(examSubSectionId, request);

                return ResponseEntity.ok(
                                ApiResponse.success("SubSection settings updated successfully", null));
        }

        @PostMapping("/subsections/{examSubSectionId}/generate")
        public ResponseEntity<ApiResponse<Void>> generateQuestions(
                        @PathVariable Long examSubSectionId) {

                examStructureService.generateQuestionsForSubSection(examSubSectionId);

                return ResponseEntity.ok(
                                ApiResponse.success("Questions generated successfully", null));
        }

        /*
         * ============================================================
         * EXAM VIEW
         * ============================================================
         */

        @GetMapping("/{examId}/structure")
        public ResponseEntity<ApiResponse<ExamStructureResponseDto>> getExamStructure(
                        @PathVariable Long examId) {

                ExamStructureResponseDto structure = examService.getExamStructure(examId);

                return ResponseEntity.ok(
                                ApiResponse.success("Exam structure fetched successfully", structure));
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<ExamResponseDto>>> getMyExams() {

                List<ExamResponseDto> exams = examService.getMyExams();

                return ResponseEntity.ok(
                                ApiResponse.success("Exams fetched successfully", exams));
        }
}