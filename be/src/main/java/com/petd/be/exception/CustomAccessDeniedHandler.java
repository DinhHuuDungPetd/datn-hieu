package com.petd.be.exception;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.petd.be.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {



  @Override
  public void handle(HttpServletRequest request,
      HttpServletResponse response,
      AccessDeniedException accessDeniedException) throws IOException {

    ApiResponse apiResponse = ApiResponse.builder()
        .message("You do not have permission to perform this action")
        .code(4003)
        .build();
    ObjectMapper mapper = new ObjectMapper();

    response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
    response.setContentType("application/json");
    response.getWriter().write(mapper.writeValueAsString(apiResponse));
  }
}
