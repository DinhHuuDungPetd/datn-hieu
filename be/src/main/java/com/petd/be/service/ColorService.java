package com.petd.be.service;

import com.petd.be.dto.request.product.ColorRequest;
import com.petd.be.dto.response.product.ColorResponse;
import com.petd.be.entity.Color;
import com.petd.be.exception.AppException;
import com.petd.be.exception.ErrorCode;
import com.petd.be.mapper.Product.ColorMapper;
import com.petd.be.repository.ColorRepository;
import java.util.Optional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ColorService {
     ColorRepository colorRepository;
     ColorMapper colorMapper;


    public List<ColorResponse> findAll() {
        return colorMapper.toColorResponseList(
            colorRepository.findAll()
        );
    }

    public Color findById(String id) {
        return colorRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
    public ColorResponse getById(String id) {
        Color color = colorRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return colorMapper.toColorResponse(color);
    }

    public ColorResponse createColor(ColorRequest colorRequest) {
        Optional<Color> optional = colorRepository.findByName(colorRequest.getName());
        if (optional.isPresent()) {
            throw new AppException(ErrorCode.RECORD_ALREADY_EXISTS);
        }
        Color color = colorMapper.toColor(colorRequest);
        color.setIsActive(true);
        return colorMapper.toColorResponse(colorRepository.save(color));
    }

    public List<ColorResponse> getByIsActive(Boolean isActive) {
        return colorMapper.toColorResponseList(colorRepository.findByIsActive(isActive));
    }

    public void deleteById(String id) {
        colorRepository.deleteById(id);
    }
} 