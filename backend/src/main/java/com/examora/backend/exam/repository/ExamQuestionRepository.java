package com.examora.backend.exam.repository;

import com.examora.backend.exam.entity.ExamQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ExamQuestion.
 */
@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Long> {

        // List questions inside one subsection
        List<ExamQuestion> findByExamSubSectionId(Long examSubSectionId);

        // Same as above but paginated
        Page<ExamQuestion> findByExamSubSectionId(Long examSubSectionId, Pageable pageable);

        // List all questions across entire exam (used for publish + total marks)
        List<ExamQuestion> findByExamSubSection_ExamSection_Exam_Id(Long examId);

        // Check uniqueness before insert
        boolean existsByExamSubSectionIdAndOriginalQuestionId(
                        Long examSubSectionId,
                        Long originalQuestionId);

        // Bulk delete questions of subsection (used in regenerate)
        void deleteByExamSubSectionId(Long examSubSectionId);

        /**
         * Fetch questions with subsection → section → exam in one query.
         * Prevents N+1 when building structure.
         */
        @EntityGraph(attributePaths = {
                        "examSubSection",
                        "examSubSection.examSection",
                        "examSubSection.examSection.exam"
        })
        List<ExamQuestion> findWithFullHierarchyByExamSubSectionId(Long examSubSectionId);

        @Query("""
                            SELECT COALESCE(SUM(q.marks), 0)
                            FROM ExamQuestion q
                            WHERE q.examSubSection.examSection.exam.id = :examId
                            AND q.isRemoved = false
                        """)
        Integer calculateTotalMarks(@Param("examId") Long examId);

        @Query("""
                            SELECT COUNT(q)
                            FROM ExamQuestion q
                            WHERE q.examSubSection.id = :subId
                            AND q.isRemoved = false
                        """)
        long countActiveBySubSection(@Param("subId") Long subId);

        List<ExamQuestion> findByExamSubSection_ExamSection_Exam_IdAndIsRemovedFalseOrderByIdAsc(Long examId);

        @EntityGraph(attributePaths = {
                        "examSubSection",
                        "options"
        })
        Page<ExamQuestion> findWithSubSectionByExamSubSectionId(
                        Long examSubSectionId,
                        Pageable pageable);

}