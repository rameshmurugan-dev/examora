package com.examora.backend.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Standard API response wrapper for Examora.
 *
 * Production features:
 * - Immutable
 * - Structured error format
 * - Frontend-safe
 * - Trace ready
 *
 * @param <T> response payload type
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final int status;
    private final String message;
    private final T data;
    private final String errorCode;
    private final LocalDateTime timestamp;
    private final String path;
    private final String traceId;

    /*
     * ======================================================
     * SUCCESS FACTORY METHODS
     * ======================================================
     */

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .status(200)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> success(T data) {
        return success("Request successful", data);
    }

    public static <T> ApiResponse<T> successMessage(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .status(200)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /*
     * ======================================================
     * ERROR FACTORY METHOD
     * ======================================================
     */

    public static <T> ApiResponse<T> error(
            String message,
            T data,
            String errorCode,
            int status,
            String path) {

        return ApiResponse.<T>builder()
                .success(false)
                .status(status)
                .message(message)
                .data(data)
                .errorCode(errorCode)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }
}