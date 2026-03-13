package com.examora.backend.superadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for system dashboard statistics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemDashboardDTO {

    private Long totalUsers;
    private Long totalAdmins;
    private Long totalStudents;
    private Long totalExams;
}