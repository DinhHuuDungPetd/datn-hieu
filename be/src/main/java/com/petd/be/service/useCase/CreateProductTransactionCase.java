package com.petd.be.service.useCase;

import com.petd.be.dto.request.product.ProductRequest;
import com.petd.be.dto.response.product.ProductResponse;
import com.petd.be.entity.Color;
import com.petd.be.entity.Product;
import com.petd.be.entity.ProductImage;
import com.petd.be.entity.ProductItem;
import com.petd.be.entity.Size;
import com.petd.be.mapper.Product.ColorMapper;
import com.petd.be.mapper.Product.SizeMapper;
import com.petd.be.repository.ProductImageRepository;
import com.petd.be.repository.ProductItemRepository;
import com.petd.be.repository.ProductRepository;
import com.petd.be.service.ColorService;
import com.petd.be.service.SizeService;
import com.petd.be.until.ProductStatus;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CreateProductTransactionCase {

  ColorService colorService;
  SizeService sizeService;
  ProductRepository productRepository;
  ProductItemRepository productItemRepository;
  ProductImageRepository productImageRepository;

  @Transactional
  public Product createProduct(ProductRequest productRequest, String createBy) {
    Product product = Product.builder()
        .productName(productRequest.getProductName())
        .description(productRequest.getDescription())
        .status(ProductStatus.ACTIVE.toString())
        .createdBy(createBy)
        .build();
    productRepository.save(product);
    List<ProductItem> productItems = new ArrayList<>();
    productRequest.getProductItems().forEach(productItemRequest -> {
      Color color = colorService.findById(productItemRequest.getColorId());
      Size size = sizeService.findById(productItemRequest.getSizeId());
      ProductItem productItem = ProductItem.builder()
          .color(color)
          .size(size)
          .price(productItemRequest.getPrice())
          .product(product)
          .quantity(productItemRequest.getQuantity())
          .imageUrl(productItemRequest.getImageUrl())
          .createdBy(createBy)
          .build();
      productItems.add(productItem);
    });
    productItemRepository.saveAll(productItems);
    List<ProductImage> productImages = new ArrayList<>();
    productRequest.getImages().forEach(productImageRequest -> {
      ProductImage productImage = ProductImage.builder()
          .url(productImageRequest.getUrl())
          .product(product)
          .isMain(productImageRequest.getIsMain())
          .createdBy(createBy)
          .build();
      productImages.add(productImage);
    });
    productImageRepository.saveAll(productImages);
    product.setProductItems(productItems);
    product.setProductImages(productImages);

    return product;
  }

}
