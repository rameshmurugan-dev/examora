package com.examora.backend.attempt.entity;

/**
 * Represents lifecycle state of an exam attempt.
 *
 * IN_PROGRESS - Attempt active and editable
 * SUBMITTED - Manually submitted by student
 * AUTO_SUBMITTED - System submitted due to timeout
 *
 * Layer: Entity
 */
public enum AttemptStatus {
    IN_PROGRESS,
    SUBMITTED,
    AUTO_SUBMITTED
}