package com.examora.backend.questionbank.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubSectionResponse {

    private final Long id;
    private final String name;
    private final Long sectionId;
    private final String sectionName;
    private final LocalDateTime createdAt;
}