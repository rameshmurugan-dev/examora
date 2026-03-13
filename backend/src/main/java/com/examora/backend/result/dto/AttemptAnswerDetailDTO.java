package com.examora.backend.result.dto;

import com.examora.backend.attempt.dto.OptionDTO;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * Immutable DTO representing detailed per-question result.
 */
@Getter
@Builder
public class AttemptAnswerDetailDTO {

    private final Long questionId;
    private final String questionText;
    private final List<OptionDTO> options;

    private final String selectedOption;
    private final String correctOption;

    private final Integer marksAwarded;

    private final AnswerStatus status;
}