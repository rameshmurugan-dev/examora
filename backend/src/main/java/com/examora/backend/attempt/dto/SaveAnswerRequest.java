package com.examora.backend.attempt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload for saving a student's answer.
 *
 * Layer: DTO (Request)
 */
@Getter
@Setter
@NoArgsConstructor
public class SaveAnswerRequest {

    @NotNull(message = "Question ID is required.")
    private Long questionId;

    @NotBlank(message = "Selected option is required.")
    private String selectedOption;
}