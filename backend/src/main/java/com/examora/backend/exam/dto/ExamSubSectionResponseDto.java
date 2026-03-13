package com.examora.backend.exam.dto;

import com.examora.backend.exam.entity.SelectionMode;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExamSubSectionResponseDto {

    private Long id;
    private Long subSectionId;
    private String title;

    private Integer questionLimit;
    private SelectionMode selectionMode;

    private Integer easyPercentage;
    private Integer mediumPercentage;
    private Integer hardPercentage;

    private Boolean shuffleQuestions;

    private int totalQuestions;
    private int activeQuestions;
}