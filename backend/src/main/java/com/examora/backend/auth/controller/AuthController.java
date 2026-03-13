package com.examora.backend.auth.controller;

import com.examora.backend.auth.dto.ActivateStudentRequest;
import com.examora.backend.auth.dto.LoginRequest;
import com.examora.backend.auth.dto.UserResponse;
import com.examora.backend.auth.service.AuthService;
import com.examora.backend.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 *
 * Handles:
 * - Login
 * - Fetch current profile
 * - Invite validation
 * - Student activation
 */
@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class AuthController {

        private final AuthService authService;

        /**
         * Authenticates user and returns JWT token.
         */
        @PostMapping("/login")
        public ResponseEntity<ApiResponse<String>> login(
                        @Valid @RequestBody LoginRequest request) {

                String token = authService.login(request);

                return ResponseEntity.ok(
                                ApiResponse.success("Login successful", token));
        }

        /**
         * Returns currently authenticated user profile.
         */
        @GetMapping("/me")
        public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {

                return ResponseEntity.ok(
                                ApiResponse.success(
                                                "User profile fetched",
                                                authService.getCurrentUser()));
        }

        /**
         * Validates invite token before activation.
         */
        @GetMapping("/invite/validate")
        public ResponseEntity<ApiResponse<String>> validateInvite(
                        @RequestParam String token) {

                return ResponseEntity.ok(
                                ApiResponse.success(
                                                "Invite link valid",
                                                authService.validateInviteToken(token)));
        }

        /**
         * Activates invited student account.
         */
        @PostMapping("/invite/activate")
        public ResponseEntity<ApiResponse<Void>> activateStudent(
                        @Valid @RequestBody ActivateStudentRequest request) {

                authService.activateStudent(request);

                return ResponseEntity.ok(
                                ApiResponse.successMessage("Account activated successfully"));
        }
}