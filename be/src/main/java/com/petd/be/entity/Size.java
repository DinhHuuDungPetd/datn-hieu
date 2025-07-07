package com.petd.be.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "sizes", uniqueConstraints = {
    @jakarta.persistence.UniqueConstraint(columnNames = {"name"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Size {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Column(nullable = false)
  String name;

  Boolean isActive;

  @CreatedDate
  @Column(updatable = false)
  LocalDateTime createdAt;
  @LastModifiedDate
  LocalDateTime updatedAt;
  String createdBy;

  @OneToMany(mappedBy = "size")
  List<ProductItem> productItems = new ArrayList<>();
}
