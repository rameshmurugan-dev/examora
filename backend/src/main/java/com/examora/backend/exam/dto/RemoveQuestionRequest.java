package com.examora.backend.exam.dto;

import lombok.Data;

/**
 * DTO for toggling question removal (soft delete).
 */
@Data
public class RemoveQuestionRequest {

    private boolean removed;
}