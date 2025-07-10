package com.petd.be.api;


import com.petd.be.dto.ApiResponse;
import com.petd.be.dto.request.product.ProductRequest;
import com.petd.be.dto.request.product.ProductSearchRequest;
import com.petd.be.dto.response.product.AttributeResponse;
import com.petd.be.dto.response.product.ProductDetailsResponse;
import com.petd.be.dto.response.product.ProductResponse;
import com.petd.be.service.ProductService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/manager/product")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductManagerApi {

  ProductService productService;

  @GetMapping
  public ApiResponse<List<ProductResponse>> getProducts() {

    return ApiResponse.<List<ProductResponse>>builder()
        .result(productService.getAllProducts())
        .build();
  }

  @PostMapping("/search")
  public ApiResponse<Page<ProductResponse>> searchProducts(
      @RequestBody(required = false) ProductSearchRequest request,
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(defaultValue = "10") int size
  ) {
    Pageable pageable = PageRequest.of(pageNumber, size);
    return ApiResponse.<Page<ProductResponse>>builder()
        .result(productService.search(request, pageable))
        .build();
  }

  @GetMapping("/get-attributes")
  public ApiResponse<AttributeResponse> getAttributes() {
    return ApiResponse.<AttributeResponse>builder()
        .result(productService.getAllAttributes())
        .build();
  }

  @PostMapping
  public ApiResponse<ProductDetailsResponse> createProduct(@RequestBody ProductRequest request) {
    return ApiResponse.<ProductDetailsResponse>builder()
        .result(productService.createProduct(request))
        .build();
  }
  @PutMapping("/{productId}/update")
  public ApiResponse<ProductDetailsResponse> updateProduct(
      @RequestBody ProductRequest request,
      @PathVariable String productId) {
    return ApiResponse.<ProductDetailsResponse>builder()
        .result(productService.updateProduct(request, productId))
        .build();
  }

  @GetMapping("/{productId}")
  public ApiResponse<ProductDetailsResponse> getProductDetails(@PathVariable String productId) {
    return ApiResponse.<ProductDetailsResponse>builder()
            .result(productService.getProductDetails(productId))
            .build();
  }

  @PutMapping("{productId}/change-status")
  public ApiResponse<ProductResponse> updateProductStatus(
      @PathVariable(name = "productId") String productId,
      @RequestParam(required = true) String status
  ){
    return ApiResponse.<ProductResponse>builder()
        .result(productService.changeStatus(productId, status))
        .build();
  }

}
