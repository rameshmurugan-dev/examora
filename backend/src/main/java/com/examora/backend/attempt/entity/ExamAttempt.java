package com.examora.backend.attempt.entity;

import com.examora.backend.exam.entity.Exam;
import com.examora.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

/**
 * Represents a student's attempt of an exam.
 *
 * Business Rules:
 * - One attempt per student per exam
 * - Status transitions:
 * IN_PROGRESS → SUBMITTED
 * IN_PROGRESS → AUTO_SUBMITTED
 * - Once submitted, attempt is immutable
 *
 * Layer: Entity
 */
@Entity
@Table(name = "exam_attempts", uniqueConstraints = {
                @UniqueConstraint(name = "uk_exam_student", columnNames = { "exam_id", "student_id" })
}, indexes = {
                @Index(name = "idx_attempt_exam", columnList = "exam_id"),
                @Index(name = "idx_attempt_student", columnList = "student_id"),
                @Index(name = "idx_attempt_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamAttempt {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        /**
         * Version field for optimistic locking.
         */
        @Version
        private Long version;

        /**
         * Exam being attempted.
         */
        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "exam_id", nullable = false)
        @OnDelete(action = OnDeleteAction.CASCADE)
        private Exam exam;

        /**
         * Student taking the exam.
         */
        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "student_id", nullable = false)
        @OnDelete(action = OnDeleteAction.CASCADE)
        private User student;

        /**
         * When the attempt started.
         */
        @Column(nullable = false, updatable = false)
        private LocalDateTime startedAt;

        /**
         * When the attempt expires.
         */
        @Column(nullable = false, updatable = false)
        private LocalDateTime expiresAt;

        /**
         * When the attempt was submitted (manual or auto).
         */
        private LocalDateTime submittedAt;

        /**
         * Current attempt status.
         */
        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 30)
        private AttemptStatus status;

        @Column(length = 100)
        private String sessionToken;

}