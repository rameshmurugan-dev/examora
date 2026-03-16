package com.examora.backend.common.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    @Value("${SENDGRID_API_KEY}")
    private String sendgridApiKey;

    @Value("${SENDGRID_FROM_EMAIL}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendStudentInvite(String toEmail, String token) {

        if (toEmail == null || toEmail.isBlank()) {
            return;
        }

        try {

            String activationLink = frontendUrl + "/activate?token=" + token;

            String emailBody = "You have been invited to Examora.\n\n"
                    + "Activate your account:\n"
                    + activationLink + "\n\n"
                    + "This link is valid for 48 hours.\n\n"
                    + "If you did not expect this email, ignore it.";

            Map<String, Object> payload = Map.of(
                    "personalizations", List.of(
                            Map.of("to", List.of(Map.of("email", toEmail)))
                    ),
                    "from", Map.of("email", fromEmail),
                    "subject", "Activate your Examora account",
                    "content", List.of(
                            Map.of("type", "text/plain", "value", emailBody)
                    )
            );

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.sendgrid.com/v3/mail/send"))
                    .header("Authorization", "Bearer " + sendgridApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response =
                    HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

            log.info("Invite email sent to {} | Status {}", toEmail, response.statusCode());

        } catch (Exception e) {

            log.error("Failed to send invite email to {} : {}", toEmail, e.getMessage());
        }
    }
}