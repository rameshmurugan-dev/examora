package com.examora.backend.exam.dto;

import com.examora.backend.exam.entity.SelectionMode;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO for updating subsection configuration.
 */
@Data
public class ExamSubSectionSettingsRequest {

    @NotNull(message = "Selection mode is required")
    private SelectionMode selectionMode;

    @Min(value = 1, message = "Question limit must be at least 1")
    private Integer questionLimit;

    @Min(value = 0, message = "Easy percentage cannot be negative")
    @Max(value = 100, message = "Easy percentage cannot exceed 100")
    private Integer easyPercentage;

    @Min(value = 0, message = "Medium percentage cannot be negative")
    @Max(value = 100, message = "Medium percentage cannot exceed 100")
    private Integer mediumPercentage;

    @Min(value = 0, message = "Hard percentage cannot be negative")
    @Max(value = 100, message = "Hard percentage cannot exceed 100")
    private Integer hardPercentage;

    private Boolean shuffleQuestions;
}