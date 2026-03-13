package com.examora.backend.attempt.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * Represents an option for a question.
 *
 * Layer: DTO (Response)
 */
@Getter
@Builder
public class OptionDTO {

    private final String id;     // e.g., "A"
    private final String text;   // Display text
}