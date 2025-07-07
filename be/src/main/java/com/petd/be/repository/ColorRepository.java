package com.petd.be.repository;

import com.petd.be.entity.Color;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColorRepository extends JpaRepository<Color, String> {

  Optional<Color> findByName(String name);
  List<Color> findByIsActive(Boolean isActive);
} 