package com.petd.be.service;

import com.petd.be.dto.request.UserRequest;
import com.petd.be.dto.response.UserResponse;
import com.petd.be.entity.User;
import com.petd.be.exception.AppException;
import com.petd.be.exception.ErrorCode;
import com.petd.be.mapper.UserMapper;
import com.petd.be.repository.UserRepository;
import com.petd.be.service.useCase.CreateUserTransactionCase;
import com.petd.be.until.Role;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {

  UserRepository userRepository;
  CreateUserTransactionCase createUserTransactionCase;
  UserMapper userMapper;

  public User getByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(()  -> new AppException(ErrorCode.USER_NOT_FOUND));
  }

  public UserResponse createAdmin(UserRequest userRequest) {
    return userMapper
        .userToUserResponse(createUserTransactionCase.createUser(userRequest, Role.ADMIN));
  }

  public UserResponse createEmployee(UserRequest userRequest) {
    return userMapper
        .userToUserResponse(createUserTransactionCase.createUser(userRequest, Role.EMPLOYEE));
  }


  public Boolean isExistEmail(String email) {
    return userRepository.existsByEmail(email);
  }

  public User getUserLogin() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
      return null;
    }
    return (User) authentication.getPrincipal();
  }

}
