package com.petd.be.mapper.Product;

import com.petd.be.dto.request.product.ColorRequest;
import com.petd.be.dto.response.product.ColorResponse;
import com.petd.be.entity.Color;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ColorMapper {
  Color toColor(ColorRequest color);
  ColorResponse toColorResponse(Color color);

  List<ColorResponse> toColorResponseList(List<Color> colors);
}
