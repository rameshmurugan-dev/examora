package com.examora.backend.student.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Aggregated dashboard response for student home screen.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardResponseDTO {

    private StudentDashboardDTO stats;

    private List<StudentExamDTO> recentExams;

    private List<StudentAttemptDTO> recentAttempts;
}