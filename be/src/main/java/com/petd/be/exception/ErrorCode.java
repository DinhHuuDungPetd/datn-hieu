package com.petd.be.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
  UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
  NOT_FOUND_BODY(40004, "Not found Body request", HttpStatus.NOT_FOUND),

  INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
  FORBIDDEN_ACTION(4003, "You do not have permission to perform this action", HttpStatus.FORBIDDEN),
  USER_NOT_FOUND(4004, "User Not Found", HttpStatus.NOT_FOUND),
  USER_ALREADY_EXISTS(4003, "User already exists.", HttpStatus.CONFLICT),
  TEAM_NAME_IN_VALID(4003, "team name isn't valid", HttpStatus.CONFLICT),

  EMAIL_NOT_BLANK(4003, "Email is blank", HttpStatus.CONFLICT),
  PASSWORD_NOT_BLANK(4003, "Password is blank", HttpStatus.CONFLICT),
  COLOR_NAME_NOT_BLACK(4003, "Color name isn't black", HttpStatus.CONFLICT),
  SIZE_NAME_NOT_BLACK(4003, "Size name isn't black", HttpStatus.CONFLICT),

  TOKEN_EXPIRED(10018, "Token has expired", HttpStatus.BAD_REQUEST),
  TOKEN_INVALID(10019, "Token has invalid format", HttpStatus.BAD_REQUEST),

  NOT_FOUND(4004, "Not Found", HttpStatus.NOT_FOUND),
  RECORD_ALREADY_EXISTS(4004, "Record already exists", HttpStatus.CONFLICT),

  ;

  private final int code;
  private final String message;
  private final HttpStatusCode statusCode;
  ErrorCode(int code, String message, HttpStatusCode statusCode) {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
  }
}
