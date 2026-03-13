package com.examora.backend.exam.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

/**
 * SubSection inside an Exam Section.
 */
@Entity
@Table(name = "exam_sub_sections", uniqueConstraints = {
                @UniqueConstraint(name = "uk_exam_subsection", columnNames = { "exam_section_id", "subSectionId" })
}, indexes = {
                @Index(name = "idx_exam_subsection_section", columnList = "exam_section_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamSubSection {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Version
        private Long version;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "exam_section_id", nullable = false)
        @OnDelete(action = OnDeleteAction.CASCADE)
        @JsonIgnore
        private ExamSection examSection;

        @Column(nullable = false)
        private Long subSectionId; // Question bank reference

        @Column(nullable = false, length = 255)
        private String title;

        @OneToMany(mappedBy = "examSubSection", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        private List<ExamQuestion> questions = new ArrayList<>();

        @Column(name = "question_limit")
        private Integer questionLimit;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 20)
        private SelectionMode selectionMode = SelectionMode.MANUAL;

        @Column
        private Integer easyPercentage;

        @Column
        private Integer mediumPercentage;

        @Column
        private Integer hardPercentage;

        @Column(nullable = false)
        private Boolean shuffleQuestions = false;
}