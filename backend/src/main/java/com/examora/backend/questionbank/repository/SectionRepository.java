package com.examora.backend.questionbank.repository;

import com.examora.backend.questionbank.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing Sections.
 */
@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {

    /**
     * Check if section name already exists.
     */
    boolean existsByNameIgnoreCase(String name);

    /**
     * Check duplicate on update.
     */
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    /**
     * Fetch all sections ordered by name.
     */
    List<Section> findAllByOrderByNameAsc();
}