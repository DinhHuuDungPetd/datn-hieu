package com.petd.be.dto.response.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductItemResponse {
  String id;
  ColorResponse color;
  SizeResponse size;
  BigDecimal price;
  Long quantity;
  String imageUrl;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;
  String createdBy;
}
