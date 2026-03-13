package com.examora.backend.analytics.controller;

import com.examora.backend.analytics.dto.ExamAnalyticsDetailDTO;
import com.examora.backend.analytics.dto.ExamAnalyticsSummaryDTO;
import com.examora.backend.analytics.dto.QuestionAnalyticsDTO;
import com.examora.backend.analytics.dto.SectionAnalyticsDTO;
import com.examora.backend.analytics.service.AnalyticsService;
import com.examora.backend.common.response.ApiResponse;
import com.examora.backend.security.UserDetailsImpl;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Provides admin-level analytics for exams.
 *
 * Responsibilities:
 * - Exam summary analytics
 * - Exam detailed analytics
 * - Section-level breakdown
 * - Question-level breakdown
 *
 * NOTE:
 * Controller contains no business logic.
 * Authentication and ownership validation are delegated to service.
 *
 * Layer: Controller
 */
@RestController
@RequestMapping("/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Validated
public class AnalyticsController {

        private final AnalyticsService analyticsService;

        /**
         * GET /admin/analytics/exams
         * Returns summary analytics for all exams created by current admin.
         */
        @GetMapping("/exams")
        public ResponseEntity<ApiResponse<List<ExamAnalyticsSummaryDTO>>> getAllExamsAnalytics(
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                List<ExamAnalyticsSummaryDTO> response = analyticsService.getAllExamsAnalytics(userDetails.getId());

                return ResponseEntity.ok(
                                ApiResponse.success("Exam analytics fetched successfully", response));
        }

        /**
         * GET /admin/analytics/exams/{examId}
         * Returns detailed analytics for a specific exam.
         */
        @GetMapping("/exams/{examId}")
        public ResponseEntity<ApiResponse<ExamAnalyticsDetailDTO>> getExamAnalyticsDetail(
                        @PathVariable @NotNull Long examId,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                ExamAnalyticsDetailDTO response = analyticsService.getExamAnalyticsDetail(userDetails.getId(), examId);

                return ResponseEntity.ok(
                                ApiResponse.success("Exam analytics detail fetched successfully", response));
        }

        /**
         * GET /admin/analytics/exams/{examId}/sections
         * Returns section-wise analytics for an exam.
         */
        @GetMapping("/exams/{examId}/sections")
        public ResponseEntity<ApiResponse<List<SectionAnalyticsDTO>>> getSectionAnalytics(
                        @PathVariable @NotNull Long examId,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                List<SectionAnalyticsDTO> response = analyticsService.getSectionAnalytics(userDetails.getId(), examId);

                return ResponseEntity.ok(
                                ApiResponse.success("Section analytics fetched successfully", response));
        }

        /**
         * GET /admin/analytics/exams/{examId}/questions
         * Returns question-wise analytics for an exam.
         */
        @GetMapping("/exams/{examId}/questions")
        public ResponseEntity<ApiResponse<List<QuestionAnalyticsDTO>>> getQuestionAnalytics(
                        @PathVariable @NotNull Long examId,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                List<QuestionAnalyticsDTO> response = analyticsService.getQuestionAnalytics(userDetails.getId(),
                                examId);

                return ResponseEntity.ok(
                                ApiResponse.success("Question analytics fetched successfully", response));
        }
}