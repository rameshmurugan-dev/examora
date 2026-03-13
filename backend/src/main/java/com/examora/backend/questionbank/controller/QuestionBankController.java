package com.examora.backend.questionbank.controller;

import com.examora.backend.common.response.ApiResponse;
import com.examora.backend.questionbank.dto.*;
import com.examora.backend.questionbank.service.QuestionBankService;
import com.examora.backend.questionbank.service.QuestionBulkUploadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/admin/question-bank")
@RequiredArgsConstructor
@Validated
public class QuestionBankController {

        private static final int MAX_PAGE_SIZE = 50;

        private final QuestionBankService questionBankService;
        private final QuestionBulkUploadService questionBulkUploadService;

        // ============================================================
        // SECTIONS
        // ============================================================

        @PostMapping("/sections")
        public ResponseEntity<ApiResponse<SectionResponse>> createSection(
                        @Valid @RequestBody SectionRequest request) {

                SectionResponse response = questionBankService.createSection(request);

                return ResponseEntity
                                .created(URI.create("/admin/question-bank/sections/" + response.getId()))
                                .body(ApiResponse.success("Section created successfully", response));
        }

        @GetMapping("/sections")
        public ResponseEntity<ApiResponse<List<SectionResponse>>> getAllSections() {

                return ResponseEntity.ok(
                                ApiResponse.success("Sections fetched successfully",
                                                questionBankService.getAllSections()));
        }

        @PutMapping("/sections/{id}")
        public ResponseEntity<ApiResponse<SectionResponse>> updateSection(
                        @PathVariable Long id,
                        @Valid @RequestBody SectionRequest request) {

                return ResponseEntity.ok(
                                ApiResponse.success("Section updated successfully",
                                                questionBankService.updateSection(id, request)));
        }

        @DeleteMapping("/sections/{id}")
        public ResponseEntity<Void> deleteSection(@PathVariable Long id) {

                questionBankService.deleteSection(id);
                return ResponseEntity.noContent().build();
        }

        // ============================================================
        // SUBSECTIONS
        // ============================================================

        @PostMapping("/sections/{sectionId}/subsections")
        public ResponseEntity<ApiResponse<SubSectionResponse>> createSubSection(
                        @PathVariable Long sectionId,
                        @Valid @RequestBody SubSectionRequest request) {

                SubSectionResponse response = questionBankService.createSubSection(sectionId, request);

                return ResponseEntity
                                .created(URI.create("/admin/question-bank/subsections/" + response.getId()))
                                .body(ApiResponse.success("SubSection created successfully", response));
        }

        @GetMapping("/sections/{sectionId}/subsections")
        public ResponseEntity<ApiResponse<List<SubSectionResponse>>> getSubSections(
                        @PathVariable Long sectionId) {

                return ResponseEntity.ok(
                                ApiResponse.success("SubSections fetched successfully",
                                                questionBankService.getSubSectionsBySectionId(sectionId)));
        }

        @PutMapping("/subsections/{id}")
        public ResponseEntity<ApiResponse<SubSectionResponse>> updateSubSection(
                        @PathVariable Long id,
                        @Valid @RequestBody SubSectionRequest request) {

                return ResponseEntity.ok(
                                ApiResponse.success("SubSection updated successfully",
                                                questionBankService.updateSubSection(id, request)));
        }

        @DeleteMapping("/subsections/{id}")
        public ResponseEntity<Void> deleteSubSection(@PathVariable Long id) {

                questionBankService.deleteSubSection(id);
                return ResponseEntity.noContent().build();
        }

        // ============================================================
        // QUESTIONS
        // ============================================================

        @PostMapping("/subsections/{subSectionId}/questions")
        public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(
                        @PathVariable Long subSectionId,
                        @Valid @RequestBody QuestionRequest request) {

                QuestionResponse response = questionBankService.createQuestion(subSectionId, request);

                return ResponseEntity
                                .created(URI.create("/admin/question-bank/questions/" + response.getId()))
                                .body(ApiResponse.success("Question created successfully", response));
        }

        @GetMapping("/subsections/{subSectionId}/questions")
        public ResponseEntity<ApiResponse<Page<QuestionResponse>>> getQuestions(
                        @PathVariable Long subSectionId,
                        @PageableDefault(size = 10) Pageable pageable) {

                if (pageable.getPageSize() > MAX_PAGE_SIZE) {
                        pageable = Pageable.ofSize(MAX_PAGE_SIZE).withPage(pageable.getPageNumber());
                }

                return ResponseEntity.ok(
                                ApiResponse.success("Questions fetched successfully",
                                                questionBankService.getQuestionsBySubSectionId(subSectionId,
                                                                pageable)));
        }

        @PutMapping("/questions/{id}")
        public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(
                        @PathVariable Long id,
                        @Valid @RequestBody QuestionRequest request) {

                return ResponseEntity.ok(
                                ApiResponse.success("Question updated successfully",
                                                questionBankService.updateQuestion(id, request)));
        }

        @DeleteMapping("/questions/{id}")
        public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {

                questionBankService.deleteQuestion(id);
                return ResponseEntity.noContent().build();
        }

        // ============================================================
        // BULK UPLOAD
        // ============================================================

        @PostMapping(value = "/subsections/{subSectionId}/questions/bulk-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponse<BulkQuestionUploadResultDTO>> bulkUpload(
                        @PathVariable Long subSectionId,
                        @RequestParam("file") MultipartFile file) {

                BulkQuestionUploadResultDTO result = questionBulkUploadService.upload(subSectionId, file);

                String message = "Bulk upload completed. Created: " + result.getCreated()
                                + ", Skipped: " + result.getSkipped();

                return ResponseEntity.ok(
                                ApiResponse.success(message, result));
        }
}