package com.examora.backend.security;

import com.examora.backend.common.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Handles unauthorized access attempts (401).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

        private final ObjectMapper objectMapper;

        @Override
        public void commence(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        AuthenticationException ex) throws IOException {

                log.warn("Unauthorized request to {}", request.getRequestURI());

                ApiResponse<Object> apiResponse = ApiResponse.error(
                                "Unauthorized access",
                                null,
                                "AUTH_UNAUTHORIZED",
                                HttpStatus.UNAUTHORIZED.value(),
                                request.getRequestURI());

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");

                response.getWriter()
                                .write(objectMapper.writeValueAsString(apiResponse));
        }
}