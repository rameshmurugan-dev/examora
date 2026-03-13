package com.examora.backend.superadmin.repository;

import com.examora.backend.superadmin.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for AuditLog persistence.
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // Returns all logs ordered by latest first
    List<AuditLog> findAllByOrderByTimestampDesc();

    // Returns logs created after given date
    List<AuditLog> findByTimestampAfterOrderByTimestampDesc(LocalDateTime cutoff);
}