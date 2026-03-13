package com.examora.backend.exam.repository;

import com.examora.backend.exam.entity.Exam;
import com.examora.backend.exam.entity.ExamStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Exam entity.
 */
@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    // Find exams by lifecycle status
    List<Exam> findByStatus(ExamStatus status);

    // Count exams by lifecycle status
    long countByStatus(ExamStatus status);

    // List exams created by specific admin
    List<Exam> findByCreatedBy(Long createdBy);

    /**
     * Fetch exam with sections and subsections in one query.
     * Useful for structure loading.
     */
    @EntityGraph(attributePaths = {
            "examSections",
            "examSections.subSections"
    })
    List<Exam> findDetailedByCreatedBy(Long createdBy);

    @EntityGraph(attributePaths = {
            "examSections",
            "examSections.subSections",
            "examSections.subSections.questions"
    })
    Optional<Exam> findFullStructureById(Long examId);
}