package com.examora.backend.common.service;

import com.examora.backend.security.UserDetailsImpl;
import com.examora.backend.superadmin.entity.AuditLog;
import com.examora.backend.superadmin.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Centralized Audit Service.
 *
 * Records security-sensitive administrative actions.
 * This service must NEVER break the main transaction flow.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Logs system-level action.
     *
     * @param action      short action code (e.g. BLOCK_USER)
     * @param description human readable description
     * @param targetId    affected entity id (nullable)
     */
    public void log(String action, String description, Long targetId) {

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null ||
                    !(authentication.getPrincipal() instanceof UserDetailsImpl user)) {
                return;
            }

            String role = user.getAuthorities().stream()
                    .findFirst()
                    .map(a -> a.getAuthority())
                    .orElse("UNKNOWN");

            AuditLog audit = AuditLog.builder()
                    .actorId(user.getId())
                    .actorRole(role)
                    .action(action)
                    .description(description)
                    .targetId(targetId)
                    .build();

            auditLogRepository.save(audit);

        } catch (Exception ex) {
            // Audit must never break business logic
            log.error("Audit logging failed: {}", ex.getMessage());
        }
    }
}