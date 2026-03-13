package com.examora.backend.common.exception;

import com.examora.backend.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Global exception handler.
 *
 * Converts all exceptions into consistent ApiResponse format.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

        /*
         * ==============================
         * AUTHENTICATION & AUTHORIZATION
         * ==============================
         */

        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ApiResponse<Object>> handleBadCredentials(
                        HttpServletRequest request) {

                return buildError(
                                "Invalid email or password",
                                "AUTH_INVALID_CREDENTIALS",
                                HttpStatus.UNAUTHORIZED,
                                request);
        }

        @ExceptionHandler({ DisabledException.class, LockedException.class })
        public ResponseEntity<ApiResponse<Object>> handleAccountStatus(
                        HttpServletRequest request) {

                return buildError(
                                "User account is inactive or blocked",
                                "AUTH_ACCOUNT_DISABLED",
                                HttpStatus.UNAUTHORIZED,
                                request);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ApiResponse<Object>> handleAccessDenied(
                        HttpServletRequest request) {

                return buildError(
                                "Access denied: insufficient permissions",
                                "ACCESS_DENIED",
                                HttpStatus.FORBIDDEN,
                                request);
        }

        /*
         * ==============================
         * VALIDATION
         * ==============================
         */

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(
                        MethodArgumentNotValidException ex,
                        HttpServletRequest request) {

                Map<String, String> errors = new LinkedHashMap<>();

                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> errors.put(error.getField(),
                                                error.getDefaultMessage()));

                log.warn("Validation error at {} : {}", request.getRequestURI(), errors);

                ApiResponse<Map<String, String>> response = ApiResponse.error(
                                "Validation failed",
                                errors,
                                "VALIDATION_ERROR",
                                HttpStatus.BAD_REQUEST.value(),
                                request.getRequestURI());

                return ResponseEntity.badRequest().body(response);
        }

        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<ApiResponse<Object>> handleConstraintViolation(
                        HttpServletRequest request) {

                return buildError(
                                "Validation error",
                                "CONSTRAINT_VIOLATION",
                                HttpStatus.BAD_REQUEST,
                                request);
        }

        /*
         * ==============================
         * BUSINESS
         * ==============================
         */

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ApiResponse<Object>> handleNotFound(
                        ResourceNotFoundException ex,
                        HttpServletRequest request) {

                return buildError(
                                ex.getMessage(),
                                "RESOURCE_NOT_FOUND",
                                HttpStatus.NOT_FOUND,
                                request);
        }

        @ExceptionHandler(InvalidActionException.class)
        public ResponseEntity<ApiResponse<Object>> handleInvalidAction(
                        InvalidActionException ex,
                        HttpServletRequest request) {

                return buildError(
                                ex.getMessage(),
                                "INVALID_ACTION",
                                HttpStatus.BAD_REQUEST,
                                request);
        }

        @ExceptionHandler(UnauthorizedException.class)
        public ResponseEntity<ApiResponse<Object>> handleUnauthorized(
                        UnauthorizedException ex,
                        HttpServletRequest request) {

                return buildError(
                                ex.getMessage(),
                                "UNAUTHORIZED",
                                HttpStatus.FORBIDDEN,
                                request);
        }

        /*
         * ==============================
         * GLOBAL FALLBACK
         * ==============================
         */

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<Object>> handleGlobal(
                        Exception ex,
                        HttpServletRequest request) {

                log.error("Unexpected error at {}", request.getRequestURI(), ex);

                return buildError(
                                "An unexpected error occurred. Please contact support.",
                                "INTERNAL_SERVER_ERROR",
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                request);
        }

        /*
         * ==============================
         * COMMON BUILDER
         * ==============================
         */

        private ResponseEntity<ApiResponse<Object>> buildError(
                        String message,
                        String errorCode,
                        HttpStatus status,
                        HttpServletRequest request) {

                ApiResponse<Object> response = ApiResponse.error(
                                message,
                                null,
                                errorCode,
                                status.value(),
                                request.getRequestURI());

                return ResponseEntity.status(status).body(response);
        }
}