package com.examora.backend.analytics.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * Section-level analytics breakdown.
 *
 * Layer: DTO (Response)
 */
@Getter
@Builder
public class SectionAnalyticsDTO {

    private final Long sectionId;
    private final String sectionName;

    private final Double averageMarks;
    private final Double accuracyPercentage;

    private final Integer questionCount;
}