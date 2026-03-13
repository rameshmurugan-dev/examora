package com.examora.backend.questionbank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Represents a major subject area.
 * Top-level organizational unit in the question bank.
 */
@Entity
@Table(name = "sections", uniqueConstraints = {
                @UniqueConstraint(name = "uk_section_name", columnNames = "name")
}, indexes = {
                @Index(name = "idx_section_name", columnList = "name")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Section {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Version
        private Long version;

        @Column(nullable = false, length = 150)
        private String name;

        @Column(nullable = false, length = 500)
        private String description;

        @CreationTimestamp
        @Column(nullable = false, updatable = false)
        private LocalDateTime createdAt;
}