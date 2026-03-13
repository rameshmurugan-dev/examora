package com.examora.backend.questionbank.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

import com.examora.backend.questionbank.entity.DifficultyLevel;

/**
 * Question response DTO.
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuestionResponse {

    private final Long id;
    private final String questionText;
    private final List<String> options;
    private final String correctOption;
    private final Integer marks;
    private final DifficultyLevel difficultyLevel;
    private final Long subSectionId;
    private final String subSectionName;
    private final LocalDateTime createdAt;
}