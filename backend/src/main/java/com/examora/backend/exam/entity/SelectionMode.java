package com.examora.backend.exam.entity;

/**
 * Question selection strategy.
 */
public enum SelectionMode {
    MANUAL, // Admin selects manually
    RANDOM, // Random from bank
    SMART // Difficulty-distributed
}