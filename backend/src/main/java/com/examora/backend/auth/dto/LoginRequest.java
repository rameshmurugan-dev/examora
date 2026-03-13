package com.examora.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Login request DTO.
 */
@Getter
@Setter
public class LoginRequest {

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(max = 100)
    private String password;
}