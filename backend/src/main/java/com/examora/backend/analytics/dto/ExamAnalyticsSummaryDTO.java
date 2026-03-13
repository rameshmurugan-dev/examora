package com.examora.backend.analytics.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * High-level analytics summary for an exam.
 *
 * Used in dashboard listing.
 *
 * Layer: DTO (Response)
 */
@Getter
@Builder
public class ExamAnalyticsSummaryDTO {

    private final Long examId;
    private final String title;

    private final Long totalAttempts;
    private final Double averageScore;
    private final Double passPercentage;
    private final Double avgCompletionTimeSeconds;
}