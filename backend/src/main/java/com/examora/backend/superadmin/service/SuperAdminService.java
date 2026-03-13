package com.examora.backend.superadmin.service;

import com.examora.backend.common.exception.InvalidActionException;
import com.examora.backend.common.exception.ResourceNotFoundException;
import com.examora.backend.common.service.AuditService;
import com.examora.backend.common.service.MailService;
import com.examora.backend.exam.repository.ExamRepository;
import com.examora.backend.security.UserDetailsImpl;
import com.examora.backend.superadmin.dto.UserManagementDTO;
import com.examora.backend.superadmin.dto.AuditLogDTO;
import com.examora.backend.superadmin.dto.CreateAdminRequest;
import com.examora.backend.superadmin.dto.SystemDashboardDTO;
import com.examora.backend.superadmin.dto.UpdateAdminRequest;
import com.examora.backend.superadmin.repository.AuditLogRepository;
import com.examora.backend.user.entity.Role;
import com.examora.backend.user.entity.User;
import com.examora.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Super Admin Service
 *
 * Handles:
 * - Admin lifecycle management
 * - Student invitation management
 * - Blocking / unblocking users
 * - System dashboard metrics
 * - Audit log retrieval
 *
 * IMPORTANT:
 * This is a governance-level service.
 * Every method must be defensive and safe.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SuperAdminService {

    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final AuditService auditService;

    /**
     * Returns currently authenticated user.
     * Defensive cast to prevent ClassCastException.
     */
    private UserDetailsImpl getCurrentUser() {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof UserDetailsImpl user)) {
            throw new InvalidActionException("Invalid authentication context");
        }

        return user;
    }

    /*
     * =====================================================
     * CREATE ADMIN
     * =====================================================
     */

    @Transactional
    public void createAdmin(CreateAdminRequest request) {

        if (request == null) {
            throw new InvalidActionException("Invalid request");
        }

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new InvalidActionException("Email already registered");
        }

        User admin = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .blocked(false)
                .active(true) // Admin active by default
                .build();

        userRepository.save(admin);

        log.info("Admin created: {}", email);

        auditService.log(
                "CREATE_ADMIN",
                "Created admin " + email,
                admin.getId());
    }

    /*
     * =====================================================
     * UPDATE ADMIN
     * =====================================================
     */

    @Transactional
    public void updateAdmin(Long adminId, UpdateAdminRequest request) {

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new InvalidActionException("User is not an ADMIN");
        }

        String newEmail = request.getEmail().trim().toLowerCase();

        // Prevent email collision
        if (!admin.getEmail().equalsIgnoreCase(newEmail)
                && userRepository.existsByEmail(newEmail)) {
            throw new InvalidActionException("Email already in use");
        }

        admin.setName(request.getName().trim());
        admin.setEmail(newEmail);

        log.info("Admin updated: {}", newEmail);

        auditService.log(
                "UPDATE_ADMIN",
                "Updated admin " + newEmail,
                adminId);
    }

    /*
     * =====================================================
     * DELETE USER
     * =====================================================
     */

    @Transactional
    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Safety: Prevent deletion of Super Admin
        if (user.getRole() == Role.SUPER_ADMIN) {
            throw new InvalidActionException("Super Admin cannot be deleted");
        }

        userRepository.delete(user);

        log.warn("User deleted: {}", user.getEmail());

        auditService.log(
                "DELETE_USER",
                "Deleted " + user.getRole() + " user " + user.getEmail(),
                userId);
    }

    /*
     * =====================================================
     * DASHBOARD SUMMARY
     * =====================================================
     */

    @Transactional(readOnly = true)
    public SystemDashboardDTO getDashboardSummary() {

        long totalUsers = userRepository.count();
        long totalAdmins = userRepository.countByRole(Role.ADMIN);
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalExams = examRepository.count();

        return SystemDashboardDTO.builder()
                .totalUsers(totalUsers)
                .totalAdmins(totalAdmins)
                .totalStudents(totalStudents)
                .totalExams(totalExams)
                .build();
    }

    /*
     * =====================================================
     * LIST ADMINS
     * =====================================================
     */

    @Transactional(readOnly = true)
    public List<UserManagementDTO> getAdmins() {

        return userRepository.findByRole(Role.ADMIN)
                .stream()
                .map(this::mapToAdminDTO)
                .collect(Collectors.toList());
    }

    /*
     * =====================================================
     * LIST STUDENTS
     * =====================================================
     */

    @Transactional(readOnly = true)
    public List<UserManagementDTO> getStudents() {

        return userRepository.findByRole(Role.STUDENT)
                .stream()
                .map(this::mapToAdminDTO)
                .collect(Collectors.toList());
    }

    /**
     * Derives general user activity status (Admin).
     */
    private String deriveStatus(User user) {

        LocalDateTime lastLogin = user.getLastLoginAt();

        if (lastLogin == null) {
            return "NEVER";
        }

        long days = Duration
                .between(lastLogin, LocalDateTime.now())
                .toDays();

        if (days <= 7)
            return "ACTIVE";
        if (days <= 30)
            return "IDLE";
        return "INACTIVE";
    }

    /*
     * =====================================================
     * BLOCK USER
     * =====================================================
     */

    @Transactional
    public void blockUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.SUPER_ADMIN) {
            throw new InvalidActionException("Cannot block Super Admin");
        }

        user.setBlocked(true);

        log.warn("User blocked: {}", user.getEmail());

        auditService.log("BLOCK_USER",
                "Blocked user " + user.getEmail(),
                userId);
    }

    /*
     * =====================================================
     * UNBLOCK USER
     * =====================================================
     */

    @Transactional
    public void unblockUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setBlocked(false);

        log.info("User unblocked: {}", user.getEmail());

        auditService.log("UNBLOCK_USER",
                "Unblocked user " + user.getEmail(),
                userId);
    }

    /*
     * =====================================================
     * AUDIT LOG RETRIEVAL
     * =====================================================
     */

    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAuditLogs(int days) {

        if (days <= 0) {
            throw new InvalidActionException("Days must be greater than zero");
        }

        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);

        return auditLogRepository
                .findByTimestampAfterOrderByTimestampDesc(cutoff)
                .stream()
                .map(log -> {

                    User actor = userRepository
                            .findById(log.getActorId())
                            .orElse(null);

                    return AuditLogDTO.builder()
                            .id(log.getId())
                            .timestamp(log.getTimestamp())
                            .actorRole(log.getActorRole())
                            .actorName(actor != null ? actor.getName() : "Unknown")
                            .actorEmail(actor != null ? actor.getEmail() : "Unknown")
                            .action(log.getAction())
                            .description(log.getDescription())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /*
     * =====================================================
     * INVITE STUDENT
     * =====================================================
     */

    @Transactional
    public void inviteStudent(String email) {

        if (email == null || email.isBlank()) {
            throw new InvalidActionException("Email is required");
        }

        String normalizedEmail = email.trim().toLowerCase();
        String token = UUID.randomUUID().toString();

        User existing = userRepository.findByEmail(normalizedEmail).orElse(null);

        // Already active
        if (existing != null && existing.isActive()) {
            throw new InvalidActionException("Student already active");
        }

        // Re-invite existing inactive student
        if (existing != null) {

            existing.setInviteToken(token);
            existing.setInviteExpiry(LocalDateTime.now().plusHours(48));

            mailService.sendStudentInvite(existing.getEmail(), token);

            auditService.log(
                    "RESEND_INVITE",
                    "Resent invite to " + normalizedEmail,
                    existing.getId());

            log.info("Invite resent to {}", normalizedEmail);
            return;
        }

        // New student invitation
        User student = User.builder()
                .email(normalizedEmail)
                .name("INVITED")
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .role(Role.STUDENT)
                .active(false)
                .blocked(false)
                .inviteToken(token)
                .inviteExpiry(LocalDateTime.now().plusHours(48))
                .build();

        userRepository.save(student);

        mailService.sendStudentInvite(student.getEmail(), token);

        auditService.log(
                "INVITE_STUDENT",
                "Invited student " + normalizedEmail,
                student.getId());

        log.info("New student invited: {}", normalizedEmail);
    }

    /**
     * Derives student status.
     */
    private String deriveStudentStatus(User user) {

        if (user.isBlocked())
            return "BLOCKED";
        if (!user.isActive())
            return "INVITED";
        if (user.getLastLoginAt() == null)
            return "ACTIVATED";

        long days = Duration
                .between(user.getLastLoginAt(), LocalDateTime.now())
                .toDays();

        if (days <= 7)
            return "ACTIVE";
        if (days <= 30)
            return "IDLE";
        return "INACTIVE";
    }

    /**
     * Maps user entity to UserManagementDTO.
     */
    private UserManagementDTO mapToAdminDTO(User user) {

        return UserManagementDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .status(user.getRole() == Role.STUDENT
                        ? deriveStudentStatus(user)
                        : deriveStatus(user))
                .blocked(user.isBlocked())
                .build();
    }
}