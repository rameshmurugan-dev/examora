package com.examora.backend.exam.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO for updating question limit in a subsection.
 */
@Data
public class QuestionLimitDto {

    @NotNull(message = "Question limit is required")
    @Min(value = 1, message = "Question limit must be at least 1")
    private Integer questionLimit;
}