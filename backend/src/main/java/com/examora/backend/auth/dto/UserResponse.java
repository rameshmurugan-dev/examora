package com.examora.backend.auth.dto;

import com.examora.backend.user.entity.Role;
import lombok.Builder;
import lombok.Getter;

/**
 * User profile response DTO.
 * Safe to expose publicly.
 */
@Getter
@Builder
public class UserResponse {

    private final Long id;
    private final String name;
    private final String email;
    private final Role role;
    private final boolean blocked;
}