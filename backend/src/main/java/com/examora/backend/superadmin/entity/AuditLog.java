package com.examora.backend.superadmin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Records critical administrative actions for security audits.
 * Tracks who did what and when.
 *
 * Layer: Entity
 */
@Entity
@Table(name = "audit_logs", indexes = {
                @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
                @Index(name = "idx_audit_actor", columnList = "actorId")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private Long actorId;

        @Column(nullable = false, length = 50)
        private String actorRole;

        @Column(nullable = false, length = 100)
        private String action;

        @Column(columnDefinition = "TEXT")
        private String description;

        private Long targetId;

        @CreationTimestamp
        @Column(nullable = false, updatable = false)
        private LocalDateTime timestamp;
}