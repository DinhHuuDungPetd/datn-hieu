package com.petd.be.service;

import com.petd.be.dto.request.product.SizeRequest;
import com.petd.be.dto.response.product.SizeResponse;
import com.petd.be.entity.Size;
import com.petd.be.exception.AppException;
import com.petd.be.exception.ErrorCode;
import com.petd.be.mapper.Product.SizeMapper;
import com.petd.be.repository.SizeRepository;
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
public class SizeService {
    SizeRepository sizeRepository;
    SizeMapper sizeMapper;


    public List<SizeResponse> findAll() {
        return sizeMapper.toSizeResponseList(
            sizeRepository.findAll()
        );
    }

    public Size findById(String id) {
        return sizeRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
    public SizeResponse getById(String id) {
        Size size = sizeRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return sizeMapper.toSizeResponse(size);
    }

    public SizeResponse createSize(SizeRequest sizeRequest) {
        Optional<Size> optional = sizeRepository.findByName(sizeRequest.getName());
        if (optional.isPresent()) {
            throw new AppException(ErrorCode.RECORD_ALREADY_EXISTS);
        }
        Size size = sizeMapper.toSize(sizeRequest);
        size.setIsActive(true);
        return sizeMapper.toSizeResponse(sizeRepository.save(size));
    }
    public List<SizeResponse> getByIsActive(Boolean isActive) {
        return sizeMapper.toSizeResponseList(sizeRepository.findByIsActive(isActive));
    }

} 