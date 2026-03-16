package com.examora.backend.superadmin.service;

import java.io.Reader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.examora.backend.common.exception.InvalidActionException;
import com.examora.backend.common.service.AuditService;
import com.examora.backend.common.service.MailService;
import com.examora.backend.security.UserDetailsImpl;
import com.examora.backend.superadmin.dto.BulkUploadResultDTO;
import com.examora.backend.user.entity.Role;
import com.examora.backend.user.entity.User;
import com.examora.backend.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentBulkUploadService {

    private final UserRepository userRepository;
    private final AuditService auditService;
    private final MailService mailService;

    @Transactional
    public BulkUploadResultDTO upload(MultipartFile file, UserDetailsImpl actor) {

        int created = 0;
        int skipped = 0;
        List<String> errors = new ArrayList<>();

        try (
                Reader reader = new InputStreamReader(file.getInputStream());
                CSVParser parser = CSVFormat.DEFAULT
                        .withFirstRecordAsHeader()
                        .withIgnoreHeaderCase()
                        .withTrim()
                        .parse(reader)) {

            validateHeaders(parser);

            for (CSVRecord record : parser) {

                String email = record.get("email").trim().toLowerCase();
                String name = record.get("name").trim();

                if (email.isBlank() || name.isBlank()) {
                    errors.add("Row " + record.getRecordNumber() + ": Missing name/email");
                    continue;
                }

                if (userRepository.existsByEmail(email)) {
                    skipped++;
                    continue;
                }

                User student = buildInvitedStudent(email, name);
                userRepository.save(student);

                mailService.sendStudentInvite(
                        student.getEmail(),
                        student.getInviteToken());

                created++;
            }

        } catch (Exception e) {
            log.error("Bulk upload failed", e);
            errors.add("File processing failed");
        }

        auditService.log(
                "BULK_INVITE_STUDENTS",
                "Bulk upload: created=" + created + ", skipped=" + skipped,
                null);

        return BulkUploadResultDTO.builder()
                .total(created + skipped + errors.size())
                .created(created)
                .skipped(skipped)
                .errors(errors)
                .build();
    }

    private void validateHeaders(CSVParser parser) {
        if (!parser.getHeaderMap().containsKey("email")
                || !parser.getHeaderMap().containsKey("name")) {
            throw new InvalidActionException(
                    "CSV must contain headers: email, name");
        }
    }

    private User buildInvitedStudent(String email, String name) {
        return User.builder()
                .email(email)
                .name(name)
                .password(UUID.randomUUID().toString())
                .role(Role.STUDENT)
                .active(false)
                .blocked(false)
                .inviteToken(UUID.randomUUID().toString())
                .inviteExpiry(LocalDateTime.now().plusHours(48))
                .build();
    }
}