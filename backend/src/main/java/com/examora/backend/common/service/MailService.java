package com.examora.backend.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Handles outbound system emails.
 *
 * In production:
 * - Replace with HTML mail sender if required
 * - Consider async execution
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    /**
     * Sends student invite email.
     */
    public void sendStudentInvite(String toEmail, String token) {

        if (toEmail == null || toEmail.isBlank()) {
            return;
        }

        try {
            String activationLink = frontendUrl + "/activate?token=" + token;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Activate your Examora account");
            message.setText(buildInviteContent(activationLink));

            mailSender.send(message);

            log.info("Invite email sent to {}", toEmail);

        } catch (Exception ex) {
            log.error("Failed to send invite email to {} : {}", toEmail, ex.getMessage());
        }
    }

    private String buildInviteContent(String activationLink) {
        return """
                You have been invited to Examora.

                Activate your account:
                %s

                This link is valid for 48 hours.

                If you did not expect this email, please ignore it.
                """.formatted(activationLink);
    }
}