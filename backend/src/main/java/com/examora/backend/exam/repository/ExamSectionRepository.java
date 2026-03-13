package com.examora.backend.exam.repository;

import com.examora.backend.exam.entity.ExamSection;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ExamSection.
 */
@Repository
public interface ExamSectionRepository extends JpaRepository<ExamSection, Long> {

    // List all sections of an exam
    List<ExamSection> findByExamId(Long examId);

    // Find specific section inside exam
    Optional<ExamSection> findByExamIdAndSectionId(Long examId, Long sectionId);

    /**
     * Fetch sections with subsections eagerly.
     * Avoids N+1 when building exam structure.
     */
    @EntityGraph(attributePaths = {
            "subSections"
    })
    List<ExamSection> findDetailedByExamId(Long examId);
}