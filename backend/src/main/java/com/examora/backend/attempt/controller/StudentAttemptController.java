package com.examora.backend.attempt.controller;

import com.examora.backend.attempt.dto.AttemptQuestionDTO;
import com.examora.backend.attempt.dto.ExamAttemptResponse;
import com.examora.backend.attempt.dto.SaveAnswerRequest;
import com.examora.backend.attempt.service.ExamAttemptService;
import com.examora.backend.common.response.ApiResponse;
import com.examora.backend.security.UserDetailsImpl;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Handles student exam attempt lifecycle.
 *
 * Responsibilities:
 * - Start or resume exam attempt
 * - Fetch attempt metadata
 * - Fetch attempt questions
 * - Save answers
 * - Submit attempt
 *
 * NOTE:
 * This controller contains NO business logic.
 * All validations and rules are delegated to the service layer.
 *
 * Layer: Controller
 */
@RestController
@RequestMapping("/student/attempts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
@Validated
public class StudentAttemptController {

        private final ExamAttemptService attemptService;

        /**
         * Start or resume an exam attempt.
         *
         * POST /student/attempts/exams/{examId}/start
         */
        @PostMapping("/exams/{examId}/start")
        public ResponseEntity<ApiResponse<ExamAttemptResponse>> startExam(
                        @PathVariable @NotNull Long examId,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                ExamAttemptResponse response = attemptService.startAttempt(userDetails.getId(), examId);

                return ResponseEntity
                                .status(HttpStatus.OK)
                                .body(ApiResponse.success("Exam session started successfully", response));
        }

        /**
         * Fetch attempt metadata.
         *
         * GET /student/attempts/{attemptId}
         */
        @GetMapping("/{attemptId}/session")
        public ResponseEntity<ApiResponse<ExamAttemptResponse>> getAttempt(
                        @PathVariable @NotNull Long attemptId,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                ExamAttemptResponse response = attemptService.getAttempt(userDetails.getId(), attemptId);

                return ResponseEntity.ok(
                                ApiResponse.success("Attempt session retrieved successfully", response));
        }

        /**
         * Fetch questions for an attempt.
         *
         * GET /student/attempts/{attemptId}/questions
         */
        @GetMapping("/{attemptId}/questions")
        public ResponseEntity<ApiResponse<List<AttemptQuestionDTO>>> getAttemptQuestions(
                        @PathVariable @NotNull Long attemptId,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                List<AttemptQuestionDTO> questions = attemptService.getAttemptQuestions(userDetails.getId(), attemptId);

                return ResponseEntity.ok(
                                ApiResponse.success("Attempt questions fetched successfully", questions));
        }

        /**
         * Save or update an answer for a specific question.
         *
         * POST /student/attempts/{attemptId}/answers
         */
        @PostMapping("/{attemptId}/answers")
        public ResponseEntity<ApiResponse<Void>> saveAnswer(
                        @PathVariable @NotNull Long attemptId,
                        @RequestHeader("X-Attempt-Token") String token,
                        @Valid @RequestBody SaveAnswerRequest request,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                attemptService.saveAnswer(userDetails.getId(), attemptId, token, request);

                return ResponseEntity.ok(
                                ApiResponse.success("Answer saved successfully", null));
        }

        /**
         * Submit an attempt.
         *
         * POST /student/attempts/{attemptId}/submit
         *
         * This operation is idempotent:
         * - If already submitted, service will safely return the existing result.
         */
        @PostMapping("/{attemptId}/submit")
        public ResponseEntity<ApiResponse<ExamAttemptResponse>> submitAttempt(
                        @PathVariable @NotNull Long attemptId,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                ExamAttemptResponse response = attemptService.submitAttempt(userDetails.getId(), attemptId);

                return ResponseEntity.ok(
                                ApiResponse.success("Exam submitted successfully", response));
        }
}