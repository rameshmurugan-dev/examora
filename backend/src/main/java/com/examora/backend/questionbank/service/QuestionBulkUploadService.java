package com.examora.backend.questionbank.service;

import com.examora.backend.common.exception.InvalidActionException;
import com.examora.backend.common.exception.ResourceNotFoundException;
import com.examora.backend.questionbank.dto.BulkQuestionUploadResultDTO;
import com.examora.backend.questionbank.dto.QuestionRequest;
import com.examora.backend.questionbank.entity.DifficultyLevel;
import com.examora.backend.questionbank.repository.SubSectionRepository;
import lombok.RequiredArgsConstructor;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionBulkUploadService {

    // ============================================================
    // CONFIGURATION CONSTANTS
    // ============================================================

    // Maximum file size allowed for upload (2MB)
    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024;

    // Maximum number of rows allowed in bulk upload
    private static final int MAX_ROWS = 1000;


    // ============================================================
    // DEPENDENCIES
    // ============================================================

    // Core service responsible for creating questions
    private final QuestionBankService questionBankService;

    // Repository used to validate SubSection existence
    private final SubSectionRepository subSectionRepository;


    // ============================================================
    // ENTRY METHOD
    // ============================================================

    /**
     * Handles bulk upload request.
     * Detects file type and routes to appropriate processor.
     */
    public BulkQuestionUploadResultDTO upload(Long subSectionId, MultipartFile file) {

        validateSubSection(subSectionId);
        validateFile(file);

        String filename = file.getOriginalFilename().toLowerCase();

        // Process Excel file
        if (filename.endsWith(".xlsx")) {
            return processExcel(subSectionId, file);
        }

        // Process CSV file
        if (filename.endsWith(".csv")) {
            return processCSV(subSectionId, file);
        }

        throw new InvalidActionException("Only XLSX or CSV files are supported");
    }


    // ============================================================
    // CSV PROCESSING
    // ============================================================

    /**
     * Processes CSV bulk upload.
     * Each row is converted to QuestionRequest and saved.
     */
    private BulkQuestionUploadResultDTO processCSV(Long subSectionId, MultipartFile file) {

        int created = 0;
        int skipped = 0;
        int rowCount = 0;

        List<String> errors = new ArrayList<>();

        try (
                Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
                CSVParser parser = CSVFormat.DEFAULT
                        .builder()
                        .setHeader()
                        .setSkipHeaderRecord(true) // ignore first row
                        .setIgnoreHeaderCase(true)
                        .setTrim(true)
                        .build()
                        .parse(reader)
        ) {

            // Ensure all required headers exist
            validateHeaders(parser);

            for (CSVRecord record : parser) {

                rowCount++;

                // Protect server from extremely large uploads
                if (rowCount > MAX_ROWS) {
                    throw new InvalidActionException("Maximum allowed rows exceeded");
                }

                try {

                    QuestionRequest request = buildRequest(record);

                    // Delegate creation to QuestionBankService
                    questionBankService.createQuestion(subSectionId, request);

                    created++;

                } catch (Exception ex) {

                    // Row level failure should not stop the entire upload
                    errors.add("Row " + record.getRecordNumber() + ": " + ex.getMessage());
                    skipped++;
                }
            }

        } catch (Exception ex) {
            throw new InvalidActionException("Failed to process CSV: " + ex.getMessage());
        }

        return BulkQuestionUploadResultDTO.builder()
                .total(created + skipped)
                .created(created)
                .skipped(skipped)
                .errors(errors)
                .build();
    }


    // ============================================================
    // EXCEL PROCESSING
    // ============================================================

    /**
     * Processes Excel (.xlsx) uploads using Apache POI.
     */
    private BulkQuestionUploadResultDTO processExcel(Long subSectionId, MultipartFile file) {

        int created = 0;
        int skipped = 0;

        List<String> errors = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);

            // Used to safely read cell values regardless of cell type
            DataFormatter formatter = new DataFormatter();

            for (Row row : sheet) {

                // Skip header row
                if (row.getRowNum() == 0) {
                    continue;
                }

                try {

                    String questionText = formatter.formatCellValue(row.getCell(0)).trim();

                    // Skip completely empty rows
                    if (questionText.isBlank()) {
                        continue;
                    }

                    List<String> options = List.of(
                            formatter.formatCellValue(row.getCell(1)).trim(),
                            formatter.formatCellValue(row.getCell(2)).trim(),
                            formatter.formatCellValue(row.getCell(3)).trim(),
                            formatter.formatCellValue(row.getCell(4)).trim()
                    );

                    String correctOption = formatter.formatCellValue(row.getCell(5)).trim();

                    int marks = Integer.parseInt(
                            formatter.formatCellValue(row.getCell(6)).trim()
                    );

                    DifficultyLevel difficulty = DifficultyLevel.valueOf(
                            formatter.formatCellValue(row.getCell(7)).trim().toUpperCase()
                    );

                    QuestionRequest request = QuestionRequest.builder()
                            .questionText(questionText)
                            .options(options)
                            .correctOption(correctOption)
                            .marks(marks)
                            .difficultyLevel(difficulty)
                            .build();

                    // Save question
                    questionBankService.createQuestion(subSectionId, request);

                    created++;

                } catch (Exception ex) {

                    // Collect row errors instead of stopping upload
                    errors.add("Row " + (row.getRowNum() + 1) + ": " + ex.getMessage());
                    skipped++;
                }
            }

        } catch (Exception ex) {
            throw new InvalidActionException("Failed to process XLSX file");
        }

        return BulkQuestionUploadResultDTO.builder()
                .total(created + skipped)
                .created(created)
                .skipped(skipped)
                .errors(errors)
                .build();
    }


    // ============================================================
    // VALIDATIONS
    // ============================================================

    /**
     * Validate uploaded file properties.
     */
    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new InvalidActionException("CSV file is required");
        }

        String filename = file.getOriginalFilename().toLowerCase();

        if (!filename.endsWith(".csv") && !filename.endsWith(".xlsx")) {
            throw new InvalidActionException("Only CSV or XLSX files are supported");
        }

        // Protect server from large uploads
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidActionException("File size exceeds 2MB limit");
        }
    }

    /**
     * Ensure SubSection exists before uploading questions.
     */
    private void validateSubSection(Long subSectionId) {

        if (!subSectionRepository.existsById(subSectionId)) {
            throw new ResourceNotFoundException("SubSection not found");
        }
    }

    /**
     * Validate required CSV headers.
     */
    private void validateHeaders(CSVParser parser) {

        List<String> requiredHeaders = List.of(
                "questionText",
                "option1",
                "option2",
                "option3",
                "option4",
                "correctOption",
                "marks",
                "difficultyLevel"
        );

        for (String header : requiredHeaders) {

            if (!parser.getHeaderMap().containsKey(header)) {

                throw new InvalidActionException(
                        "Missing required header: " + header
                );
            }
        }
    }


    // ============================================================
    // BUILD REQUEST OBJECT
    // ============================================================

    /**
     * Convert CSV row into QuestionRequest DTO.
     */
    private QuestionRequest buildRequest(CSVRecord record) {

        String questionText = record.get("questionText").trim();

        if (questionText.isBlank()) {
            throw new InvalidActionException("Question text cannot be blank");
        }

        List<String> options = List.of(
                record.get("option1").trim(),
                record.get("option2").trim(),
                record.get("option3").trim(),
                record.get("option4").trim()
        );

        int marks;
        try {
            marks = Integer.parseInt(record.get("marks").trim());
        } catch (NumberFormatException ex) {
            throw new InvalidActionException("Marks must be a valid integer");
        }

        DifficultyLevel difficulty;
        try {
            difficulty = DifficultyLevel.valueOf(
                    record.get("difficultyLevel").trim().toUpperCase()
            );
        } catch (Exception ex) {
            throw new InvalidActionException("Invalid difficulty level");
        }

        return QuestionRequest.builder()
                .questionText(questionText)
                .options(options)
                .correctOption(record.get("correctOption").trim())
                .marks(marks)
                .difficultyLevel(difficulty)
                .build();
    }
}