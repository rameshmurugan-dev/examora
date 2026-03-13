package com.examora.backend.result.controller;

import com.examora.backend.common.response.ApiResponse;
import com.examora.backend.result.dto.AttemptAnswerDetailDTO;
import com.examora.backend.result.dto.ResultDTO;
import com.examora.backend.result.service.ResultService;
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
 * Provides student access to exam results.
 *
 * Responsibilities:
 * - Overall result summary
 * - Per-question detailed breakdown
 *
 * NOTE:
 * No business logic here.
 * Ownership and validation handled in service layer.
 *
 * Layer: Controller
 */
@RestController
@RequestMapping("/student/attempts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
@Validated
public class ResultController {

        private final ResultService resultService;

        /**
         * GET /student/attempts/{attemptId}/result
         * Returns overall result summary.
         */
        @GetMapping("/{attemptId}/result")
        public ResponseEntity<ApiResponse<ResultDTO>> getResult(
                        @PathVariable @NotNull Long attemptId,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                ResultDTO response = resultService.getResult(userDetails.getId(), attemptId);

                return ResponseEntity.ok(
                                ApiResponse.success("Result fetched successfully", response));
        }

        /**
         * GET /student/attempts/{attemptId}/answers
         * Returns per-question answer breakdown.
         */
        @GetMapping("/{attemptId}/answers")
        public ResponseEntity<ApiResponse<List<AttemptAnswerDetailDTO>>> getAttemptAnswers(
                        @PathVariable @NotNull Long attemptId,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                List<AttemptAnswerDetailDTO> response = resultService.getAttemptAnswers(userDetails.getId(), attemptId);

                return ResponseEntity.ok(
                                ApiResponse.success("Answer breakdown fetched successfully", response));
        }
}