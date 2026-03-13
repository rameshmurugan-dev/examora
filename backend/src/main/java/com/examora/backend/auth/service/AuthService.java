package com.examora.backend.auth.service;

import com.examora.backend.auth.dto.ActivateStudentRequest;
import com.examora.backend.auth.dto.LoginRequest;
import com.examora.backend.auth.dto.UserResponse;
import com.examora.backend.common.exception.InvalidActionException;
import com.examora.backend.common.exception.ResourceNotFoundException;
import com.examora.backend.common.exception.UnauthorizedException;
import com.examora.backend.security.JwtUtils;
import com.examora.backend.security.UserDetailsImpl;
import com.examora.backend.user.entity.User;
import com.examora.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Authentication service.
 *
 * Handles login, invite validation, activation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

        private final AuthenticationManager authenticationManager;
        private final UserRepository userRepository;
        private final JwtUtils jwtUtils;
        private final PasswordEncoder passwordEncoder;

        /**
         * Authenticates user and returns JWT token.
         */
        @Transactional
        public String login(LoginRequest request) {

                String normalizedEmail = request.getEmail().trim().toLowerCase();

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                normalizedEmail,
                                                request.getPassword()));

                SecurityContextHolder.getContext()
                                .setAuthentication(authentication);

                UserDetailsImpl principal = (UserDetailsImpl) authentication.getPrincipal();

                User user = userRepository.findById(principal.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                user.setLastLoginAt(LocalDateTime.now());

                log.info("Login success for user: {}", normalizedEmail);

                return jwtUtils.generateJwtToken(authentication);
        }

        /**
         * Returns authenticated user profile.
         */
        @Transactional(readOnly = true)
        public UserResponse getCurrentUser() {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                if (authentication == null || !authentication.isAuthenticated()) {
                        throw new UnauthorizedException("User not authenticated");
                }

                UserDetailsImpl principal = (UserDetailsImpl) authentication.getPrincipal();

                User user = userRepository.findById(principal.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                return UserResponse.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .blocked(user.isBlocked())
                                .build();
        }

        /**
         * Validates invite token.
         */
        @Transactional(readOnly = true)
        public String validateInviteToken(String token) {

                User user = findInvitedUser(token);

                return user.getEmail();
        }

        /**
         * Activates student account using invite token.
         */
        @Transactional
        public void activateStudent(ActivateStudentRequest request) {

                User user = findInvitedUser(request.getToken());

                user.setName(request.getName().trim());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setActive(true);
                user.setInviteToken(null);
                user.setInviteExpiry(null);

                log.info("Student account activated: {}", user.getEmail());
        }

        /**
         * Shared invite validation logic.
         */
        private User findInvitedUser(String token) {

                if (token == null || token.isBlank()) {
                        throw new InvalidActionException("Invalid invite link");
                }

                User user = userRepository.findByInviteToken(token.trim())
                                .orElseThrow(() -> new ResourceNotFoundException("Invalid invite link"));

                if (user.isActive()) {
                        throw new InvalidActionException("Account already activated");
                }

                if (user.getInviteExpiry() == null ||
                                user.getInviteExpiry().isBefore(LocalDateTime.now())) {
                        throw new InvalidActionException("Invite link expired");
                }

                return user;
        }
}