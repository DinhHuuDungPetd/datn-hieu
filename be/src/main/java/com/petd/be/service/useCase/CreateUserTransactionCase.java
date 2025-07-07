package com.petd.be.service.useCase;

import com.petd.be.dto.request.UserRequest;
import com.petd.be.entity.User;
import com.petd.be.exception.AppException;
import com.petd.be.exception.ErrorCode;
import com.petd.be.mapper.UserMapper;
import com.petd.be.repository.UserRepository;
import com.petd.be.until.Role;
import jakarta.transaction.Transactional;
import java.util.Optional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CreateUserTransactionCase {

  UserRepository userRepository;
  UserMapper userMapper;
  PasswordEncoder passwordEncoder;

  @Transactional
  public User createUser(UserRequest request, Role role) {
    Optional<User> accountExists = userRepository.findByEmail(request.getEmail());
    if(accountExists.isPresent()) {
      throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
    }
    User user = userMapper.toUser(request);
    user.setRole(role);
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    return userRepository.save(user);
  }
}
