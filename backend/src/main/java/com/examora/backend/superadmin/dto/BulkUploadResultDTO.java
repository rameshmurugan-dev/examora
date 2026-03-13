package com.examora.backend.superadmin.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Summary result for student bulk upload.
 */
@Data
@Builder
public class BulkUploadResultDTO {

    private int total;
    private int created;
    private int skipped;
    private List<String> errors;
}