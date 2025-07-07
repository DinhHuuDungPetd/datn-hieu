package com.petd.be.api;

import com.petd.be.dto.ApiResponse;
import com.petd.be.dto.request.LoginRequest;
import com.petd.be.dto.response.UserResponse;
import com.petd.be.service.AuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationApi {

  AuthenticationService authenticationService;

  @PostMapping("/login")
  public ApiResponse<UserResponse> login(@RequestBody @Valid LoginRequest request, HttpServletResponse response)
      throws Exception {
    return ApiResponse.<UserResponse>builder()
        .result(authenticationService.login(request, response))
        .build();

  }
}
