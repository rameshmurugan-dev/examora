package com.examora.backend.questionbank.repository;

import com.examora.backend.questionbank.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for managing Question Bank entries.
 *
 * Production rules:
 * - Only active questions should be returned
 * - Avoid N+1 using EntityGraph
 * - Support soft delete
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    /**
     * Fetch paginated active questions for a subsection.
     */
    @EntityGraph(attributePaths = { "subSection", "options" })
@Query("""
        SELECT q FROM Question q
        WHERE q.subSection.id = :subSectionId
        AND q.active = true
    """)
Page<Question> findBySubSectionIdAndActiveTrue(
        @Param("subSectionId") Long subSectionId,
        Pageable pageable);

    /**
     * Fetch all active questions for a subsection.
     */
    List<Question> findBySubSectionIdAndActiveTrue(Long subSectionId);

    /**
     * Fetch question by id only if active.
     */
    Optional<Question> findByIdAndActiveTrue(Long id);

    /**
     * Check duplicate active question in subsection.
     */
    boolean existsByQuestionTextIgnoreCaseAndSubSectionIdAndActiveTrue(
            String questionText,
            Long subSectionId);

    /**
     * Count active questions in subsection.
     */
    long countBySubSectionIdAndActiveTrue(Long subSectionId);
}