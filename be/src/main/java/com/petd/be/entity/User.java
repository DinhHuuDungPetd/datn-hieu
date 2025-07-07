package com.petd.be.entity;

import com.petd.be.until.Role;
import java.time.LocalDateTime;
import lombok.*;
import jakarta.persistence.*;
import java.util.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column
  private String firstName;

  @Column
  private String lastName;

  @Column
  private String phoneNumber;

  @Column(nullable = false)
  private String password;

  @Column(unique = true)
  private String email;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;

  @Builder.Default
  private boolean active = true;

  @CreatedDate
  @Column(updatable = false)
  LocalDateTime createdAt;

  @LastModifiedDate
  LocalDateTime updatedAt;



  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(this.role.toString()));
  }

  @Override
  public String getUsername() {
    return this.email;
  }

  @Override
  public boolean isAccountNonLocked() {
    return this.isActive();
  }
}
