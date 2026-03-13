package com.examora.backend.questionbank.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * Bulk upload result summary.
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BulkQuestionUploadResultDTO {

    private final int total;
    private final int created;
    private final int skipped;
    private final List<String> errors;
}