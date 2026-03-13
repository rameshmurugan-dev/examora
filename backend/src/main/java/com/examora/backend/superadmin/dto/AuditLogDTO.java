package com.examora.backend.superadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Audit log response DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDTO {

    private Long id;

    private LocalDateTime timestamp;

    private String actorRole;

    private String actorName;
    private String actorEmail;

    private String action;
    private String description;
}