package com.examora.backend.superadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for managing users by Admin.
 *
 * Layer: DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementDTO {
    private Long id;
    private String name;
    private String email;
    private String status; // Derived lifecycle status
    private boolean blocked;
}
