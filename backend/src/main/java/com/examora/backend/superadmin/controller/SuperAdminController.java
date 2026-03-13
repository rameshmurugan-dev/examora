package com.examora.backend.superadmin.controller;

import com.examora.backend.common.exception.InvalidActionException;
import com.examora.backend.common.response.ApiResponse;
import com.examora.backend.security.UserDetailsImpl;
import com.examora.backend.superadmin.dto.*;
import com.examora.backend.superadmin.service.StudentBulkUploadService;
import com.examora.backend.superadmin.service.SuperAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * SuperAdminController
 *
 * Exposes governance-level APIs.
 * Only SUPER_ADMIN can access these endpoints.
 *
 * Responsibilities:
 * - Admin lifecycle
 * - Student management
 * - Audit monitoring
 * - System dashboard
 */
@RestController
@RequestMapping(value = "/super-admin", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

        private final SuperAdminService superAdminService;
        private final StudentBulkUploadService studentBulkUploadService;

        /**
         * GET /super-admin/dashboard/summary
         *
         * Returns high-level system metrics:
         * - Total users
         * - Total admins
         * - Total students
         * - Total exams
         */
        @GetMapping("/dashboard/summary")
        public ResponseEntity<ApiResponse<SystemDashboardDTO>> getDashboardSummary() {
                return ResponseEntity.ok(
                                ApiResponse.success(
                                                "Dashboard summary fetched",
                                                superAdminService.getDashboardSummary()));
        }

        /**
         * POST /super-admin/admin
         *
         * Creates a new Admin user.
         */
        @PostMapping("/admin")
        public ResponseEntity<ApiResponse<Void>> createAdmin(
                        @Valid @RequestBody CreateAdminRequest request) {

                superAdminService.createAdmin(request);

                return ResponseEntity.ok(
                                ApiResponse.successMessage("Admin created successfully"));
        }

        /**
         * PUT /super-admin/{adminId}
         *
         * Updates an existing Admin account.
         */
        @PutMapping("/{adminId}")
        public ResponseEntity<ApiResponse<Void>> updateAdmin(
                        @PathVariable Long adminId,
                        @Valid @RequestBody UpdateAdminRequest request) {

                superAdminService.updateAdmin(adminId, request);

                return ResponseEntity.ok(
                                ApiResponse.successMessage("Admin updated successfully"));
        }

        /**
         * DELETE /super-admin/users/{userId}
         *
         * Deletes a user (Admin or Student).
         * Super Admin cannot be deleted.
         */
        @DeleteMapping("/users/{userId}")
        public ResponseEntity<ApiResponse<Void>> deleteUser(
                        @PathVariable Long userId) {

                superAdminService.deleteUser(userId);

                return ResponseEntity.ok(
                                ApiResponse.successMessage("User deleted successfully"));
        }

        /**
         * GET /super-admin/admins
         *
         * Returns list of all Admin users.
         */
        @GetMapping("/admins")
        public ResponseEntity<ApiResponse<List<UserManagementDTO>>> getAdmins() {

                return ResponseEntity.ok(
                                ApiResponse.success(
                                                superAdminService.getAdmins()));
        }

        /**
         * GET /super-admin/users/students
         *
         * Returns list of all Student users.
         */
        @GetMapping("/users/students")
        public ResponseEntity<ApiResponse<List<UserManagementDTO>>> getStudents() {

                return ResponseEntity.ok(
                                ApiResponse.success(
                                                superAdminService.getStudents()));
        }

        /**
         * PATCH /super-admin/users/{id}/block
         *
         * Blocks a user account (Admin or Student).
         */
        @PatchMapping("/users/{id}/block")
        public ResponseEntity<ApiResponse<Void>> blockUser(@PathVariable Long id) {

                superAdminService.blockUser(id);

                return ResponseEntity.ok(
                                ApiResponse.successMessage("User blocked successfully"));
        }

        /**
         * PATCH /super-admin/users/{id}/unblock
         *
         * Restores access to a blocked user.
         */
        @PatchMapping("/users/{id}/unblock")
        public ResponseEntity<ApiResponse<Void>> unblockUser(@PathVariable Long id) {

                superAdminService.unblockUser(id);

                return ResponseEntity.ok(
                                ApiResponse.successMessage("User unblocked successfully"));
        }

        /**
         * GET /super-admin/audit-logs?days=X
         *
         * Returns audit logs for the last X days.
         * Default = 7 days.
         */
        @GetMapping("/audit-logs")
        public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAuditLogs(
                        @RequestParam(defaultValue = "7") int days) {

                return ResponseEntity.ok(
                                ApiResponse.success(
                                                superAdminService.getAuditLogs(days)));
        }

        /**
         * POST /super-admin/students/invite
         *
         * Sends invite email to a student.
         */
        @PostMapping("/students/invite")
        public ResponseEntity<ApiResponse<Void>> inviteStudent(
                        @Valid @RequestBody InviteStudentRequest request) {

                superAdminService.inviteStudent(request.getEmail());

                return ResponseEntity.ok(
                                ApiResponse.successMessage("Student invited successfully"));
        }

        /**
         * POST /super-admin/students/invite/resend
         *
         * Resends invite email to an existing inactive student.
         */
        @PostMapping("/students/invite/resend")
        public ResponseEntity<ApiResponse<Void>> resendInvite(
                        @Valid @RequestBody InviteStudentRequest request) {

                superAdminService.inviteStudent(request.getEmail());

                return ResponseEntity.ok(
                                ApiResponse.successMessage("Invite resent successfully"));
        }

        /**
         * POST /super-admin/students/bulk-upload
         *
         * Uploads CSV file containing student data.
         * Required headers: email, name
         */
        @PostMapping(value = "/students/bulk-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponse<BulkUploadResultDTO>> bulkUploadStudents(
                        @RequestParam("file") MultipartFile file) {

                // Validate file presence
                if (file == null || file.isEmpty()) {
                        throw new InvalidActionException("CSV file is required");
                }

                // Validate file type safely
                String filename = file.getOriginalFilename();
                if (filename == null || !filename.toLowerCase().endsWith(".csv")) {
                        throw new InvalidActionException("Only CSV files are supported");
                }

                // Safe extraction of authenticated user
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                if (authentication == null ||
                                !(authentication.getPrincipal() instanceof UserDetailsImpl actor)) {
                        throw new InvalidActionException("Invalid authentication context");
                }

                return ResponseEntity.ok(
                                ApiResponse.success(
                                                "Bulk upload completed",
                                                studentBulkUploadService.upload(file, actor)));
        }
}