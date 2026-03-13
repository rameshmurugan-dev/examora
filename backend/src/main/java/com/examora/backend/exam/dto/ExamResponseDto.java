package com.examora.backend.exam.dto;

import com.examora.backend.exam.entity.ExamMode;
import com.examora.backend.exam.entity.ExamStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO returned for exam details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResponseDto {

    private Long id;
    private String title;
    private String description;
    private ExamMode examMode;
    private Integer durationMinutes;
    private Integer totalMarks;
    private BigDecimal negativeMarks;
    private ExamStatus status;
    private Long createdBy;
    private LocalDateTime createdAt;
}