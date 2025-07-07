package com.petd.be.service.useCase;

import com.petd.be.dto.request.product.ProductRequest;
import com.petd.be.entity.*;
import com.petd.be.exception.AppException;
import com.petd.be.exception.ErrorCode;
import com.petd.be.repository.ProductImageRepository;
import com.petd.be.repository.ProductItemRepository;
import com.petd.be.repository.ProductRepository;
import com.petd.be.service.ColorService;
import com.petd.be.service.SizeService;
import com.petd.be.until.ProductStatus;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UpdateProductTransactionCase {

  ColorService colorService;
  SizeService sizeService;
  ProductRepository productRepository;
  ProductItemRepository productItemRepository;
  ProductImageRepository productImageRepository;

  @Transactional
  public Product updateProduct(ProductRequest productRequest, String productId) {
    Product product =  productRepository.findById(productId)
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    product.setProductName(productRequest.getProductName());
    product.setDescription(productRequest.getDescription());

    productRepository.save(product);

    List<ProductItem> productItems =product.getProductItems();

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
