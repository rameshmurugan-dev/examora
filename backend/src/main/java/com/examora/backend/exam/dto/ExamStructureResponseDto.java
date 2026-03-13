package com.examora.backend.exam.dto;

import com.examora.backend.exam.entity.ExamMode;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO representing full hierarchical exam structure.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamStructureResponseDto {

    private Long examId;
    private String title;
    private ExamMode examMode;
    private Integer durationMinutes;
    private Integer totalMarks;
    private BigDecimal negativeMarks;

    private List<SectionNode> sections;

    /**
     * Represents a section within an exam.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SectionNode {

        private Long examSectionId;
        private Long sectionId;
        private String title;
        private List<SubSectionNode> subSections;
    }

    /**
     * Represents a subsection within a section.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubSectionNode {

        private Long examSubSectionId;
        private Long subSectionId;
        private String title;

        private int derivedQuestionCount;
        private int activeQuestionCount;
        private Integer questionLimit;

        private int easyCount;
        private int mediumCount;
        private int hardCount;
    }
}