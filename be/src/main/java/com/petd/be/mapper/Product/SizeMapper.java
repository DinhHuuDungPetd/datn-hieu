package com.petd.be.mapper.Product;

import com.petd.be.dto.request.product.SizeRequest;
import com.petd.be.dto.response.product.ColorResponse;
import com.petd.be.dto.response.product.SizeResponse;
import com.petd.be.entity.Color;
import com.petd.be.entity.Size;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SizeMapper {
  Size toSize(SizeRequest request);
  SizeResponse toSizeResponse(Size size);
  List<SizeResponse> toSizeResponseList(List<Size> sizes);
}
