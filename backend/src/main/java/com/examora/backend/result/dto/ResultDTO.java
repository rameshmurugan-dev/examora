package com.examora.backend.result.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * Immutable DTO representing overall exam result summary.
 */
@Getter
@Builder
public class ResultDTO {

    private final Integer totalQuestions;

    private final Double totalMarks;
    private final Double obtainedMarks;

    private final Integer correctCount;
    private final Integer wrongCount;
    private final Integer unattemptedCount;

    private final Double accuracyPercentage;
    private final Double negativeMarksImpact;

    private final SubmissionType submissionType;
}