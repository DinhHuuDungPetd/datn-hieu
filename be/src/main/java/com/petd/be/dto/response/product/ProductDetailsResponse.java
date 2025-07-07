package com.petd.be.dto.response.product;

import java.time.LocalDateTime;
import java.util.List;
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
public class ProductDetailsResponse {
  String id;
  String productName;
  String description;
  List<ProductImageResponse> images;
  List<ProductItemResponse> productItems;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;
  String createdBy;
}
