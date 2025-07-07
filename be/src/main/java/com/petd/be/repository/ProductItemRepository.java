package com.petd.be.repository;

import com.petd.be.entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, String> {
} 