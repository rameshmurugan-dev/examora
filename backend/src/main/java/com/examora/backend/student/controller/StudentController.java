package com.examora.backend.student.controller;

import com.examora.backend.common.response.ApiResponse;
import com.examora.backend.student.dto.StudentAttemptDTO;
import com.examora.backend.student.dto.StudentDashboardResponseDTO;
import com.examora.backend.student.dto.StudentExamDTO;
import com.examora.backend.student.dto.StudentExamDetailDTO;
import com.examora.backend.student.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for student operations.
 * Handles dashboard and exam lists.
 *
 * Layer: Controller
 */
@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

        private final StudentService studentService;

        @GetMapping("/dashboard")
        public ResponseEntity<ApiResponse<StudentDashboardResponseDTO>> getDashboard() {
                return ResponseEntity.ok(
                                ApiResponse.success(
                                                "Dashboard fetched successfully",
                                                studentService.getDashboardData()));
        }

        @GetMapping("/exams")
        public ResponseEntity<ApiResponse<List<StudentExamDTO>>> getAvailableExams() {
                return ResponseEntity.ok(
                                ApiResponse.success(
                                                "Exams fetched successfully",
                                                studentService.getAvailableExams()));
        }

        @GetMapping("/exams/{examId}")
        public ResponseEntity<ApiResponse<StudentExamDetailDTO>> getExamDetails(
                        @PathVariable Long examId) {

                return ResponseEntity.ok(
                                ApiResponse.success(
                                                "Exam details fetched successfully",
                                                studentService.getExamDetails(examId)));
        }

        @GetMapping("/attempts")
        public ResponseEntity<ApiResponse<List<StudentAttemptDTO>>> getAttemptHistory() {
                return ResponseEntity.ok(
                                ApiResponse.success(
                                                "Attempt history fetched successfully",
                                                studentService.getAttemptHistory()));
        }

        @GetMapping("/attempts/{attemptId}")
        public ResponseEntity<ApiResponse<StudentAttemptDTO>> getAttemptDetails(
                        @PathVariable Long attemptId) {

                return ResponseEntity.ok(
                                ApiResponse.success(
                                                "Attempt details fetched successfully",
                                                studentService.getAttemptDetails(attemptId)));
        }
}
