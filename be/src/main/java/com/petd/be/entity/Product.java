package com.petd.be.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
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
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  String productName;
  String description;

  @OneToMany(mappedBy = "product")
  @Builder.Default
  List<ProductImage> productImages = new ArrayList<>();

  @OneToMany(mappedBy = "product")
  @Builder.Default
  List<ProductItem> productItems = new ArrayList<>();

  String status;

  @CreatedDate
  @Column(updatable = false)
  LocalDateTime createdAt;
  @LastModifiedDate
  LocalDateTime updatedAt;
  String createdBy;
}
