package com.petd.be.dto.response;

import com.petd.be.until.Role;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
  String id;
  String firstName;
  String lastName;
  String phoneNumber;
  String email;
  Role role;
  boolean active;
  LocalDateTime createdAt;
}
