package com.petd.be.service.useCase;

import com.petd.be.dto.request.product.ProductImageRequest;
import com.petd.be.dto.request.product.ProductItemRequest;
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
    log.info("Update product with id: " + productId);
    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    product.setProductName(productRequest.getProductName());
    product.setDescription(productRequest.getDescription());

    // --- UPDATE PRODUCT IMAGES ---
    List<ProductImage> oldImages = product.getProductImages();
    List<String> newImageUrls = productRequest.getImages().stream()
        .map(ProductImageRequest::getUrl)
        .toList();
    productImageRepository.deleteAll(product.getProductImages());
    // Thêm hoặc cập nhật ảnh mới
    for (ProductImageRequest imgReq : productRequest.getImages()) {
      ProductImage img = ProductImage.builder()
          .url(imgReq.getUrl())
          .isMain(imgReq.getIsMain())
          .product(product)
          .build();
      productImageRepository.save(img);
      oldImages.add(img);
    }

    // --- UPDATE PRODUCT ITEMS ---
    List<ProductItem> oldItems = product.getProductItems();
    List<String> newItemKeys = productRequest.getProductItems().stream()
        .map(i -> i.getColorId() + "-" + i.getSizeId())
            .toList();

    for (ProductItem oldItem : oldItems) {
      String key = oldItem.getColor().getId() + "-" + oldItem.getSize().getId();
      if (!newItemKeys.contains(key)) {
         oldItem.setIsActive(false);
         productItemRepository.save(oldItem);
      }
    }

    for (ProductItemRequest itemReq : productRequest.getProductItems()) {
      String key = itemReq.getColorId() + "-" + itemReq.getSizeId();
      ProductItem item = oldItems.stream()
          .filter(i -> (i.getColor().getId() + "-" + i.getSize().getId()).equals(key))
              .findFirst()
              .orElse(null);
      Color color = colorService.findById(itemReq.getColorId());
      Size size = sizeService.findById(itemReq.getSizeId());
      if (item == null) {
        item = ProductItem.builder()
            .color(color)
            .size(size)
            .price(itemReq.getPrice())
            .product(product)
            .quantity(itemReq.getQuantity())
            .imageUrl(itemReq.getImageUrl())
            .isActive(itemReq.getActive() != null ? itemReq.getActive() : true)
            .build();
        productItemRepository.save(item);
        oldItems.add(item);
      } else {
        item.setPrice(itemReq.getPrice());
        item.setQuantity(itemReq.getQuantity());
        item.setImageUrl(itemReq.getImageUrl());
        item.setIsActive(itemReq.getActive() != null ? itemReq.getActive() : true);
        productItemRepository.save(item);
      }
    }
    product.setProductImages(oldImages);
    product.setProductItems(oldItems);
    productRepository.save(product);
    return product;
  }

}
