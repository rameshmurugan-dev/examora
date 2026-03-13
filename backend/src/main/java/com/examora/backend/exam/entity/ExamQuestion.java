package com.examora.backend.exam.entity;

import com.examora.backend.questionbank.entity.DifficultyLevel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

/**
 * Snapshot of a Question inside an Exam.
 */
@Entity
@Table(name = "exam_questions", uniqueConstraints = {
                @UniqueConstraint(name = "uk_exam_question_unique", columnNames = { "exam_sub_section_id",
                                "originalQuestionId" })
}, indexes = {
                @Index(name = "idx_exam_question_subsection", columnList = "exam_sub_section_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamQuestion {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "exam_sub_section_id", nullable = false)
        @OnDelete(action = OnDeleteAction.CASCADE)
        @JsonIgnore
        private ExamSubSection examSubSection;

        @Column(nullable = false)
        private Long originalQuestionId;

        @Column(nullable = false, columnDefinition = "TEXT")
        private String questionText;

        @ElementCollection(fetch = FetchType.LAZY)
        @CollectionTable(name = "exam_question_options", joinColumns = @JoinColumn(name = "exam_question_id"))
        @Column(name = "option_text", nullable = false)
        private List<String> options;

        @Column(nullable = false, length = 500)
        private String correctOption;

        @Column(nullable = false)
        private Integer marks;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 20)
        private DifficultyLevel difficultyLevel;

        @Column(nullable = false)
        private boolean isRemoved = false; // Soft delete
}