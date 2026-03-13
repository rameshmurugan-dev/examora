package com.examora.backend.questionbank.repository;

import com.examora.backend.questionbank.entity.SubSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing SubSections.
 */
@Repository
public interface SubSectionRepository extends JpaRepository<SubSection, Long> {

    /**
     * Fetch subsections of a section.
     */
    List<SubSection> findBySectionIdOrderByNameAsc(Long sectionId);

    /**
     * Check duplicate subsection name inside same section.
     */
    boolean existsBySectionIdAndNameIgnoreCase(Long sectionId, String name);

    /**
     * Duplicate check during update.
     */
    boolean existsBySectionIdAndNameIgnoreCaseAndIdNot(
            Long sectionId,
            String name,
            Long id);
}