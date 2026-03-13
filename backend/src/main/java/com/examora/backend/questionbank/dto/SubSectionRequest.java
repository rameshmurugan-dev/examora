package com.examora.backend.questionbank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SubSectionRequest {

    @NotBlank
    @Size(max = 255)
    private String name;
}