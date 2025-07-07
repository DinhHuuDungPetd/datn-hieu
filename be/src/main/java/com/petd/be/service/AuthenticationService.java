package com.petd.be.service;
import com.petd.be.dto.request.LoginRequest;
import com.petd.be.dto.response.UserResponse;
import com.petd.be.entity.User;
import com.petd.be.exception.AppException;
import com.petd.be.exception.ErrorCode;
import com.petd.be.mapper.UserMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {

  PasswordService passwordService;
  UserMapper userMapper;
  UserService userService;
  JwtService jwtUtils;

  public UserResponse login(LoginRequest loginRequest, HttpServletResponse response)
      throws Exception {
    User user = userService.getByEmail(loginRequest.getEmail());
    if(!passwordService.matches(loginRequest.getPassword(), user.getPassword())) {
      throw new AppException(ErrorCode.USER_NOT_FOUND);
    }
    String token = jwtUtils.generateToken(user.getEmail());

    Cookie cookie = new Cookie("token", token);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setMaxAge( (int) jwtUtils.getExpiration()/ 1000);
    response.addCookie(cookie);

    return userMapper.userToUserResponse(user);
  }

  public void logout(HttpServletResponse response) {
    Cookie cookie = new Cookie("token", "");
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setMaxAge(0);
    response.addCookie(cookie);
  }


}
