package com.examora.backend.questionbank.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a reusable question in the question bank.
 * Used for creating exam snapshots.
 */
@Entity
@Table(name = "questions", indexes = {
                @Index(name = "idx_question_subsection", columnList = "sub_section_id"),
                @Index(name = "idx_question_difficulty", columnList = "difficultyLevel")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Version
        private Long version;

        @Column(nullable = false, columnDefinition = "TEXT")
        private String questionText;

        @ElementCollection(fetch = FetchType.LAZY)
        @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
        @Column(name = "option_text", nullable = false, length = 500)
        private List<String> options;

        @Column(nullable = false, length = 500)
        private String correctOption;

        @Column(nullable = false)
        private Integer marks;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 20)
        private DifficultyLevel difficultyLevel;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "sub_section_id", nullable = false)
        @OnDelete(action = OnDeleteAction.CASCADE)
        @JsonIgnore
        private SubSection subSection;

        @Builder.Default
        @Column(nullable = false)
        private boolean active = true;

        @CreationTimestamp
        @Column(nullable = false, updatable = false)
        private LocalDateTime createdAt;
}