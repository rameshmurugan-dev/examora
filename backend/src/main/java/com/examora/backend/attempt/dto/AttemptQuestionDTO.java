package com.examora.backend.attempt.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * Represents a question inside an active attempt.
 *
 * Layer: DTO (Response)
 */
@Getter
@Builder
public class AttemptQuestionDTO {

    private final Long questionId;
    private final String questionText;
    private final List<OptionDTO> options;
    private final Integer marks;
    private final String questionType;
    private final String savedOption;
}