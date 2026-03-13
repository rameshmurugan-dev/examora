package com.examora.backend.questionbank.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SectionResponse {

    private final Long id;
    private final String name;
    private final String description;
    private final LocalDateTime createdAt;
}