package com.examora.backend.exam.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

/**
 * Section inside an Exam.
 */
@Entity
@Table(name = "exam_sections", uniqueConstraints = {
                @UniqueConstraint(name = "uk_exam_section", columnNames = { "exam_id", "sectionId" })
}, indexes = {
                @Index(name = "idx_exam_section_exam", columnList = "exam_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamSection {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Version
        private Long version;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "exam_id", nullable = false)
        @OnDelete(action = OnDeleteAction.CASCADE)
        @JsonIgnore
        private Exam exam;

        @Column(nullable = false)
        private Long sectionId; // Question bank reference

        @Column(nullable = false, length = 255)
        private String title;

        @OneToMany(mappedBy = "examSection", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        private List<ExamSubSection> subSections = new ArrayList<>();
}