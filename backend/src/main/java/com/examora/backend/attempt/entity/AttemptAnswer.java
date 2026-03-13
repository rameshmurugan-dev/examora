package com.examora.backend.attempt.entity;

import com.examora.backend.exam.entity.ExamQuestion;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

/**
 * Stores the answer selected by a student for a specific question
 * within an exam attempt.
 *
 * Constraints:
 * - One answer per question per attempt
 *
 * Layer: Entity
 */
@Entity
@Table(name = "attempt_answers", uniqueConstraints = {
                @UniqueConstraint(name = "uk_attempt_question", columnNames = { "attempt_id", "exam_question_id" })
}, indexes = {
                @Index(name = "idx_attempt_answer_attempt", columnList = "attempt_id"),
                @Index(name = "idx_attempt_answer_question", columnList = "exam_question_id"),
                @Index(name = "idx_attempt_answer_composite", columnList = "attempt_id, exam_question_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptAnswer {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        /**
         * Owning exam attempt.
         */
        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "attempt_id", nullable = false)
        @OnDelete(action = OnDeleteAction.CASCADE)
        private ExamAttempt attempt;

        /**
         * Exam question being answered.
         */
        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "exam_question_id", nullable = false)
        @OnDelete(action = OnDeleteAction.CASCADE)
        private ExamQuestion examQuestion;

        /**
         * Selected option identifier (e.g., A, B, C, D).
         */
        @Column(nullable = false, length = 50)
        private String selectedOption;

        /**
         * Timestamp of last answer save.
         */
        @Column(nullable = false)
        private LocalDateTime savedAt;
}