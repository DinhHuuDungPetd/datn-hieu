package com.petd.be.service;

import com.petd.be.dto.request.product.ProductImageRequest;
import com.petd.be.dto.request.product.ProductRequest;
import com.petd.be.dto.request.product.ProductSearchRequest;
import com.petd.be.dto.response.product.AttributeResponse;
import com.petd.be.dto.response.product.ColorResponse;
import com.petd.be.dto.response.product.ProductDetailsResponse;
import com.petd.be.dto.response.product.ProductImageResponse;
import com.petd.be.dto.response.product.ProductItemResponse;
import com.petd.be.dto.response.product.ProductResponse;
import com.petd.be.dto.response.product.SizeResponse;
import com.petd.be.entity.Color;
import com.petd.be.entity.Product;
import com.petd.be.entity.ProductImage;
import com.petd.be.entity.ProductItem;
import com.petd.be.entity.Size;
import com.petd.be.entity.User;
import com.petd.be.exception.AppException;
import com.petd.be.exception.ErrorCode;
import com.petd.be.mapper.Product.ColorMapper;
import com.petd.be.mapper.Product.SizeMapper;
import com.petd.be.repository.ProductImageRepository;
import com.petd.be.repository.ProductItemRepository;
import com.petd.be.repository.ProductRepository;
import com.petd.be.service.useCase.CreateProductTransactionCase;
import com.petd.be.service.useCase.UpdateProductTransactionCase;
import com.petd.be.specification.ProductSpecification;
import com.petd.be.until.ProductStatus;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductService {

  ColorMapper colorMapper;
  SizeMapper sizeMapper;

  UserService userService;
  ProductRepository productRepository;
  ColorService colorService;
  SizeService sizeService;
  CreateProductTransactionCase createProductTransactionCase;
  UpdateProductTransactionCase updateProductTransactionCase;

  public ProductDetailsResponse createProduct(ProductRequest productRequest) {
    User user = userService.getUserLogin();
    String createBy = user == null ? "System" : user.getEmail();
    return toProductDetailsResponse(createProductTransactionCase.createProduct(productRequest, createBy));
  }

  public ProductDetailsResponse updateProduct(ProductRequest productRequest, String productId) {
    User user = userService.getUserLogin();
    return toProductDetailsResponse(updateProductTransactionCase.updateProduct(productRequest, productId));
  }

  public ProductDetailsResponse getProductDetails(String productId) {
    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    return toProductDetailsResponse(product);
  }

  public List<ProductResponse> getAllProducts() {
    List<Product> products = productRepository.findAll();
    return  products.stream()
        .map(this::toProductResponse)
        .toList();
  }

  public Page<ProductResponse> search(ProductSearchRequest request, Pageable pageable) {
    if (request == null) {
      // Nếu pageable chưa có sort → thêm sort theo createdAt giảm dần
      if (pageable.getSort().isUnsorted()) {
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").descending());
      }
      return productRepository.findAll(pageable)
              .map(this::toProductResponse);
    }

    Specification<Product> spec = buildSpecification(request);

    // Tương tự thêm sort nếu chưa có
    if (pageable.getSort().isUnsorted()) {
      pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").descending());
    }

    Page<Product> productPage = productRepository.findAll(spec, pageable);
    return productPage.map(this::toProductResponse);
  }

  public ProductResponse changeStatus(String productId, String status) {
    try {
      ProductStatus productStatus = ProductStatus.valueOf(status.toUpperCase());
      // Giả định có hàm tìm và cập nhật sản phẩm
      Product product = productRepository.findById(productId)
          .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
      product.setStatus(productStatus.toString());
      productRepository.save(product);
      return toProductResponse(product);
    } catch (IllegalArgumentException e) {
      throw new AppException(ErrorCode.FORBIDDEN_ACTION);
    } catch (Exception e) {
      throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
    }
  }



  public ProductResponse toProductResponse(Product product) {
    ProductResponse productResponse = ProductResponse.builder()
        .id(product.getId())
        .productName(product.getProductName())
        .description(product.getDescription())
        .updatedAt(product.getUpdatedAt())
        .createdAt(product.getCreatedAt())
        .createdBy(product.getCreatedBy())
        .status(product.getStatus())
        .build();
    BigDecimal minPrice = product.getProductItems().stream()
        .map(ProductItem::getPrice)
        .min(Comparator.naturalOrder())
        .orElse(BigDecimal.ZERO);
    BigDecimal maxPrice = product.getProductItems().stream()
        .map(ProductItem::getPrice)
        .max(Comparator.naturalOrder())
        .orElse(BigDecimal.ZERO);

    String mainImageUrl = product.getProductImages().stream()
        .filter(ProductImage::getIsMain)
        .map(ProductImage::getUrl)
        .findFirst()
        .orElse(null);
    long quantity = product.getProductItems().stream()
        .mapToLong(ProductItem::getQuantity)
        .sum();

    productResponse.setMinPrice(minPrice);
    productResponse.setMaxPrice(maxPrice);
    productResponse.setMainImageUrl(mainImageUrl);
    productResponse.setQuantity(quantity);

     return productResponse;
  }

  public ProductDetailsResponse toProductDetailsResponse(Product product) {
    ProductDetailsResponse productResponse = ProductDetailsResponse.builder()
        .id(product.getId())
        .productName(product.getProductName())
        .description(product.getDescription())
        .updatedAt(product.getUpdatedAt())
        .createdAt(product.getCreatedAt())
        .createdBy(product.getCreatedBy())
        .build();

    List<ProductItemResponse> productItemResponses = new ArrayList<>();
    product.getProductItems().forEach(productItem -> {
      productItemResponses.add(toProductItemResponse(productItem));
    });
    productResponse.setProductItems(productItemResponses);

    List<ProductImageResponse> productImageResponses = new ArrayList<>();
    product.getProductImages().forEach(productImage -> {
      productImageResponses.add(toProductImageResponse(productImage));
    });
    productResponse.setImages(productImageResponses);
    return productResponse;
  }

  public ProductItemResponse toProductItemResponse(ProductItem productItem) {
    ColorResponse colorResponse = colorMapper.toColorResponse(productItem.getColor());
    SizeResponse sizeResponse = sizeMapper.toSizeResponse(productItem.getSize());
    return ProductItemResponse.builder()
        .id(productItem.getId())
        .price(productItem.getPrice())
        .quantity(productItem.getQuantity())
        .color(colorResponse)
        .size(sizeResponse)
        .isActive(productItem.getIsActive())
        .imageUrl(productItem.getImageUrl())
        .createdBy(productItem.getCreatedBy())
        .updatedAt(productItem.getUpdatedAt())
        .createdBy(productItem.getCreatedBy())
        .build();
  }

  public AttributeResponse getAllAttributes() {
    List<ColorResponse> colorResponseList = colorService.getByIsActive(true);
    List<SizeResponse> sizeResponseList = sizeService.getByIsActive(true);
    return AttributeResponse.builder()
        .sizes(sizeResponseList)
        .colors(colorResponseList)
        .build();
  }

  public ProductImageResponse toProductImageResponse(ProductImage productImage) {
    return ProductImageResponse.builder()
        .url(productImage.getUrl())
        .id(productImage.getId())
        .isMain(productImage.getIsMain())
        .build();
  }

  private Specification<Product> buildSpecification(ProductSearchRequest req) {
    Specification<Product> spec = null;

    if (req.getId() != null) {
      spec = ProductSpecification.hasId(req.getId());
    }

    Specification<Product> otherConditions = null;

    if (req.getKeyword() != null) {
      otherConditions = combine(otherConditions, ProductSpecification.hasNameLike(req.getKeyword()));
    }

    if (req.getStatus() != null) {
      otherConditions = combine(otherConditions, ProductSpecification.hasStatus(req.getStatus()));
    }

    if (req.getColorIds() != null && !req.getColorIds().isEmpty()) {
      otherConditions = combine(otherConditions, ProductSpecification.hasColorIds(req.getColorIds()));
    }

    if (req.getSizeIds() != null && !req.getSizeIds().isEmpty()) {
      otherConditions = combine(otherConditions, ProductSpecification.hasSizeIds(req.getSizeIds()));
    }

    if (req.getMinPrice() != null || req.getMaxPrice() != null) {
      otherConditions = combine(otherConditions, ProductSpecification.priceBetween(req.getMinPrice(), req.getMaxPrice()));
    }

    // Nếu có id và có điều kiện khác, kết hợp bằng OR
    if (spec != null && otherConditions != null) {
      return spec.or(otherConditions);
    }

    // Chỉ có id
    if (spec != null) {
      return spec;
    }

    // Chỉ có điều kiện khác
    return otherConditions;
  }

  private Specification<Product> combine(Specification<Product> base, Specification<Product> next) {
    return base == null ? next : base.and(next);
  }

}
