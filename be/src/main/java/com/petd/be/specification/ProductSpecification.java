package com.petd.be.specification;

import com.petd.be.entity.Product;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

  public static Specification<Product> hasNameLike(String keyword) {
    return (root, query, cb) ->
        keyword == null ? null :
            cb.like(cb.lower(root.get("productName")), "%" + keyword.toLowerCase() + "%");
  }

  public static Specification<Product> hasId(String id) {
    return (root, query, cb) ->
        id == null ? null : cb.equal(root.get("id"), id);
  }

  public static Specification<Product> hasStatus(String status) {
    return (root, query, cb) ->
        status == null ? null :
            cb.equal(root.get("status"), status);
  }

  public static Specification<Product> hasColorId(String colorId) {
    return (root, query, cb) -> {
      if (colorId == null) return null;
      Join<Object, Object> itemJoin = root.join("productItems", JoinType.LEFT);
      Join<Object, Object> colorJoin = itemJoin.join("color", JoinType.LEFT);
      return cb.equal(colorJoin.get("id"), colorId);
    };
  }

  public static Specification<Product> hasColorIds(List<String> colorIds) {
    return (root, query, cb) -> {
      if (colorIds == null || colorIds.isEmpty()) return null;
      Join<Object, Object> itemJoin = root.join("productItems", JoinType.LEFT);
      Join<Object, Object> colorJoin = itemJoin.join("color", JoinType.LEFT);
      return colorJoin.get("id").in(colorIds);
    };
  }

  public static Specification<Product> hasSizeId(String sizeId) {
    return (root, query, cb) -> {
      if (sizeId == null) return null;
      Join<Object, Object> itemJoin = root.join("productItems", JoinType.LEFT);
      Join<Object, Object> sizeJoin = itemJoin.join("size", JoinType.LEFT);
      return cb.equal(sizeJoin.get("id"), sizeId);
    };
  }

  public static Specification<Product> hasSizeIds(List<String> sizeIds) {
    return (root, query, cb) -> {
      if (sizeIds == null || sizeIds.isEmpty()) return null;
      Join<Object, Object> itemJoin = root.join("productItems", JoinType.LEFT);
      Join<Object, Object> sizeJoin = itemJoin.join("size", JoinType.LEFT);
      return sizeJoin.get("id").in(sizeIds);
    };
  }

  public static Specification<Product> priceBetween(BigDecimal min, BigDecimal max) {
    return (root, query, cb) -> {
      if (min == null && max == null) return null;
      Join<Object, Object> itemJoin = root.join("productItems", JoinType.LEFT);

      if (min != null && max != null)
        return cb.between(itemJoin.get("price"), min, max);
      else if (min != null)
        return cb.greaterThanOrEqualTo(itemJoin.get("price"), min);
      else
        return cb.lessThanOrEqualTo(itemJoin.get("price"), max);
    };
  }



}
