package com.examora.backend.questionbank.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

/**
 * Subdivision of a Section.
 */
@Entity
@Table(name = "sub_sections", uniqueConstraints = {
                @UniqueConstraint(name = "uk_section_subsection", columnNames = { "section_id", "name" })
}, indexes = {
                @Index(name = "idx_subsection_section", columnList = "section_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubSection {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Version
        private Long version;

        @Column(nullable = false, length = 150)
        private String name;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "section_id", nullable = false)
        @OnDelete(action = OnDeleteAction.CASCADE)
        @JsonIgnore
        private Section section;

        @CreationTimestamp
        @Column(nullable = false, updatable = false)
        private LocalDateTime createdAt;
}