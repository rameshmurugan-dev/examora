package com.examora.backend.exam.dto;

import com.examora.backend.exam.entity.ExamMode;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

/**
 * DTO for creating a new exam.
 */
@Data
public class ExamRequestDto {

        @NotBlank(message = "Title is required")
        @Size(max = 150, message = "Title cannot exceed 150 characters")
        private String title;

        @Size(max = 2000, message = "Description cannot exceed 2000 characters")
        private String description;

        @NotNull(message = "Exam mode is required")
        private ExamMode examMode;

        @NotNull(message = "Duration is required")
        @Min(value = 1, message = "Duration must be at least 1 minute")
        private Integer durationMinutes;

        @NotNull(message = "Negative marks is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Negative marks cannot be negative")
        @Digits(integer = 3, fraction = 2, message = "Negative marks must have up to 3 integer digits and 2 decimal places")
        private BigDecimal negativeMarks;
}