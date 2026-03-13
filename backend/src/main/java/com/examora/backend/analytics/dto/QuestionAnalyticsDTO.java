package com.examora.backend.analytics.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * Analytics metrics for a specific question.
 *
 * Layer: DTO (Response)
 */
@Getter
@Builder
public class QuestionAnalyticsDTO {

    private final Long questionId;
    private final String questionText;

    private final Double correctPercentage;
    private final Double skipPercentage;

    /**
     * Computed difficulty classification (EASY, MEDIUM, HARD).
     */
    private final String difficultyLevel;
}