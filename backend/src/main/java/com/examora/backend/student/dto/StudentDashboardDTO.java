package com.examora.backend.student.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for student's main dashboard stats.
 *
 * Layer: DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardDTO {

    private Long totalAvailable;        
    private Long completedAttempts;     
    private Double averageScore;        
}