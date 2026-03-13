package com.examora.backend.student.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for detailed exam info before starting.
 *
 * Layer: DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentExamDetailDTO {
    private Long id;
    private String title;
    private String description;
    private Integer durationMinutes;
    private Integer totalMarks;
    private BigDecimal negativeMarks;
}
