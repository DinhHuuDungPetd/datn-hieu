package com.petd.be.dto.request.product;

import java.math.BigDecimal;
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
public class ProductSearchRequest {
  private String id;
  private String keyword;
  private String status;
  private List<String> colorIds; // ✅
  private List<String> sizeIds;  // ✅
  private BigDecimal minPrice;
  private BigDecimal maxPrice;

}
