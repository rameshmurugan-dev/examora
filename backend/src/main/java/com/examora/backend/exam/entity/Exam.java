package com.examora.backend.exam.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

/**
 * Root entity representing an Exam.
 */
@Entity
@Table(name = "exams", indexes = {
                @Index(name = "idx_exam_status", columnList = "status"),
                @Index(name = "idx_exam_created_by", columnList = "createdBy")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exam {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Version // Prevents lost updates in concurrent edits
        private Long version;

        @Column(nullable = false, length = 255)
        private String title;

        @Column(columnDefinition = "TEXT")
        private String description;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 20)
        private ExamMode examMode;

        @Column(nullable = false)
        private Integer durationMinutes;

        @Column
        private Integer totalMarks;

        @Column(nullable = false, precision = 5, scale = 2)
        private BigDecimal negativeMarks;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 20)
        private ExamStatus status;

        @Column(nullable = false)
        private Long createdBy; // Admin ID

        @CreationTimestamp
        @Column(nullable = false, updatable = false)
        private LocalDateTime createdAt;

        @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        private List<ExamSection> examSections = new ArrayList<>();
}