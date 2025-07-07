package com.petd.be.dto.response.product;

import com.petd.be.dto.request.product.ProductItemRequest;
import com.petd.be.until.ProductStatus;
import java.math.BigDecimal;
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
public class ProductResponse {
  String id;
  String productName;
  String description;
  BigDecimal minPrice;
  BigDecimal maxPrice;
  String status;
  long quantity;
  String mainImageUrl;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;
  String createdBy;
}
