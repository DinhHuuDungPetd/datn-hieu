package com.petd.be.repository;

import com.petd.be.entity.Size;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeRepository extends JpaRepository<Size, String> {
  Optional<Size> findByName(String name);
  List<Size> findByIsActive(Boolean isActive);
} 