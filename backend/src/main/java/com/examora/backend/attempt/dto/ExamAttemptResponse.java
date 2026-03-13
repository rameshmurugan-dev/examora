package com.examora.backend.attempt.dto;

import com.examora.backend.attempt.entity.AttemptStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Metadata about an exam attempt session.
 *
 * Layer: DTO (Response)
 */
@Getter
@Builder
public class ExamAttemptResponse {

    private final Long id;
    private final Long examId;
    private final String examTitle;
    private final Integer durationMinutes;

    private final LocalDateTime startedAt;
    private final LocalDateTime expiresAt;
    private final LocalDateTime submittedAt;

    private final AttemptStatus status;

    private final String sessionToken;

    /**
     * Server timestamp for client synchronization.
     */
    private final LocalDateTime serverTime;
}