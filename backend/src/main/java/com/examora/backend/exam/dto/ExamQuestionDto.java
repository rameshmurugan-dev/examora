package com.examora.backend.exam.dto;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * DTO representing a question inside an exam context.
 */
@Data
@Builder
public class ExamQuestionDto {

    private Long id;
    private Long originalQuestionId;
    private Long originalSubSectionId;

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotNull(message = "Options are required")
    @Size(min = 2, message = "At least two options are required")
    private List<@NotBlank(message = "Option value cannot be blank") String> options;

    @NotBlank(message = "Correct option is required")
    private String correctOption;

    @NotNull(message = "Marks are required")
    @Min(value = 1, message = "Marks must be at least 1")
    private Integer marks;

    private boolean isRemoved;
}