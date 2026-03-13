package com.examora.backend.analytics.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * Detailed analytics for a single exam.
 *
 * Immutable response DTO.
 *
 * Layer: DTO (Response)
 */
@Getter
@Builder
public class ExamAnalyticsDetailDTO {

    private final Long examId;
    private final String title;

    private final Long totalAttempts;
    private final Double averageScore;
    private final Double passPercentage;
    private final Double avgCompletionTimeSeconds;
}