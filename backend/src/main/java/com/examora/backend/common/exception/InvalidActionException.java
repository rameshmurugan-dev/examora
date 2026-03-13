package com.examora.backend.common.exception;

/**
 * Thrown when a business rule is violated.
 */
public class InvalidActionException extends RuntimeException {

    public InvalidActionException(String message) {
        super(message);
    }

    public InvalidActionException(String message, Throwable cause) {
        super(message, cause);
    }
}