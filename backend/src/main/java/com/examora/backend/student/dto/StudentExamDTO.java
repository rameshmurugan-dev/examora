package com.examora.backend.student.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for available exam listing.
 *
 * Layer: DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentExamDTO {
    private Long id;
    private String title;
    private String description;
    private Integer durationMinutes;
    private Integer totalMarks;
    private String attemptStatus; // "NOT_STARTED", "IN_PROGRESS", "COMPLETED"
}
