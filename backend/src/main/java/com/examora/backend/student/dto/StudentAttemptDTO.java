package com.examora.backend.student.dto;

import com.examora.backend.attempt.entity.AttemptStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for listing student's exam attempts.
 *
 * Layer: DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAttemptDTO {
    private Long id;
    private Long examId;
    private String examTitle;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private AttemptStatus status;
    private Double score;
    private Integer totalMarks;
}
