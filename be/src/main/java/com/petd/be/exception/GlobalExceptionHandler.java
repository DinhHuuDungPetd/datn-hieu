package com.petd.be.exception;

import com.petd.be.dto.ApiResponse;
import jakarta.validation.ConstraintViolation;
import java.nio.file.AccessDeniedException;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  private static final String MIN_ATTRIBUTE = "min";

  @ExceptionHandler(value = Exception.class)
  public ResponseEntity<ApiResponse> handleGenericException(Exception  exception) {
    log.error("Unhandled exception occurred: ", exception);

    ApiResponse response = new ApiResponse();
    response.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
    response.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());

    return ResponseEntity.badRequest().body(response);
  }

  @ExceptionHandler(value = AppException.class)
  public ResponseEntity<ApiResponse> handleAppException(AppException exception) {
    ErrorCode errorCode = exception.getErrorCode();

    ApiResponse response = new ApiResponse();
    response.setCode(errorCode.getCode());
    response.setMessage(errorCode.getMessage());

    return ResponseEntity.status(errorCode.getStatusCode()).body(response);
  }

    @ExceptionHandler(value = AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handleAccessDeniedException(AccessDeniedException exception) {
        ErrorCode errorCode = ErrorCode.FORBIDDEN_ACTION;

        return ResponseEntity.status(errorCode.getStatusCode()).body(
            ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build()
        );
    }

  @ExceptionHandler(value = MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse> handleValidationException(MethodArgumentNotValidException exception) {
    FieldError fieldError = exception.getFieldError();
    String enumKey = (fieldError != null) ? fieldError.getDefaultMessage() : null;

    ErrorCode errorCode = ErrorCode.INVALID_KEY;
    Map<String, Object> attributes = null;

    if (enumKey != null) {
      try {
        errorCode = ErrorCode.valueOf(enumKey);

        ObjectError objectError = exception.getBindingResult().getAllErrors().stream().findFirst().orElse(null);

        if (objectError != null) {
          try {
            ConstraintViolation<?> constraintViolation = objectError.unwrap(ConstraintViolation.class);
            attributes = constraintViolation.getConstraintDescriptor().getAttributes();
            log.debug("Validation attributes: {}", attributes);
          } catch (Exception e) {
            log.warn("Unable to unwrap ConstraintViolation: {}", e.getMessage());
          }
        }

      } catch (IllegalArgumentException e) {
        log.warn("Invalid error code enumKey: {}", enumKey);
      }
    }

    ApiResponse response = new ApiResponse();
    response.setCode(errorCode.getCode());
    response.setMessage(
        (attributes != null)
            ? mapAttribute(errorCode.getMessage(), attributes)
            : errorCode.getMessage()
    );

    return ResponseEntity.status(errorCode.getStatusCode()).body(response);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<?> handleMissingRequestBody(HttpMessageNotReadableException ex) {
    ApiResponse response = new ApiResponse();
    response.setCode(HttpStatus.BAD_REQUEST.value());
    response.setMessage("Not found Body request");
    return ResponseEntity.badRequest().body(response);
  }

  private String mapAttribute(String message, Map<String, Object> attributes) {
    String minValue = String.valueOf(attributes.getOrDefault(MIN_ATTRIBUTE, ""));
    return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
  }
}
