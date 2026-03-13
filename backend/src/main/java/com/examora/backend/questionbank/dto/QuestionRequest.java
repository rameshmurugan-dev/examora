package com.examora.backend.questionbank.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;

import java.util.List;

import com.examora.backend.questionbank.entity.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * DTO for creating/updating question.
 */
@Getter
@Builder
@AllArgsConstructor
public class QuestionRequest {

    @NotBlank
    @Size(max = 2000)
    private final String questionText;

    @NotEmpty
    @Size(min = 2, max = 6)
    private final List<@NotBlank @Size(max = 500) String> options;

    @NotBlank
    private final String correctOption;

    @NotNull
    @Min(1)
    @Max(1000)
    private final Integer marks;

    @NotNull
    private final DifficultyLevel difficultyLevel;
}