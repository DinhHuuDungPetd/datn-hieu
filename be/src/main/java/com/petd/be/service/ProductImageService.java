package com.petd.be.service;

import com.petd.be.entity.ProductImage;
import com.petd.be.repository.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductImageService {
    private final ProductImageRepository productImageRepository;

    public List<ProductImage> findAll() {
        return productImageRepository.findAll();
    }

    public Optional<ProductImage> findById(String id) {
        return productImageRepository.findById(id);
    }

    public ProductImage save(ProductImage productImage) {
        return productImageRepository.save(productImage);
    }

    public void deleteById(String id) {
        productImageRepository.deleteById(id);
    }
} 