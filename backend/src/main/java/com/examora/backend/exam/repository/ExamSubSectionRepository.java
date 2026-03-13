package com.examora.backend.exam.repository;

import com.examora.backend.exam.entity.ExamSubSection;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ExamSubSection.
 */
@Repository
public interface ExamSubSectionRepository extends JpaRepository<ExamSubSection, Long> {

        // List subsections under a section
        List<ExamSubSection> findByExamSectionId(Long examSectionId);

        // Find specific subsection inside section
        Optional<ExamSubSection> findByExamSectionIdAndSubSectionId(
                        Long examSectionId,
                        Long subSectionId);

        /**
         * Fetch subsections with questions.
         * Used when generating structure.
         */
        @EntityGraph(attributePaths = {
                        "questions"
        })
        List<ExamSubSection> findDetailedByExamSectionId(Long examSectionId);
}