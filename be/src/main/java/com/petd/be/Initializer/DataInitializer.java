package com.petd.be.Initializer;

import com.petd.be.dto.request.UserRequest;
import com.petd.be.dto.request.product.ColorRequest;
import com.petd.be.dto.request.product.ProductImageRequest;
import com.petd.be.dto.request.product.ProductItemRequest;
import com.petd.be.dto.request.product.ProductRequest;
import com.petd.be.dto.request.product.SizeRequest;
import com.petd.be.dto.response.product.ColorResponse;
import com.petd.be.dto.response.product.SizeResponse;
import com.petd.be.entity.Color;
import com.petd.be.entity.Size;
import com.petd.be.repository.ColorRepository;
import com.petd.be.repository.SizeRepository;
import com.petd.be.service.ProductService;
import com.petd.be.service.UserService;
import com.petd.be.service.ColorService;
import com.petd.be.service.SizeService;
import com.petd.be.service.ProductImageService;
import com.petd.be.repository.ProductRepository;
import com.petd.be.repository.ProductItemRepository;
import java.util.Arrays;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DataInitializer implements CommandLineRunner {

  UserService userService;
  ColorService colorService;
  SizeService sizeService;
  ColorRepository colorRepository;
  SizeRepository sizeRepository;
   ProductService productService;

  @Override
  public void run(String... args) {
    initAdmin();
    initProduct();
  }

  private void initAdmin(){
    String  adminMail= "admin@petd.com";
    if(userService.isExistEmail(adminMail)){
      log.info("Admin already exist");
      return;
    }
    UserRequest userRequest = UserRequest.builder()
        .email(adminMail)
        .password("Dung1702@")
        .firstName("admin-")
        .lastName("petd")
        .phoneNumber("0386117963")
        .build();
    userService.createAdmin(userRequest);
  }

  private List<ProductImageRequest> createProductImages(String[] productImageUrls){
    List<ProductImageRequest> productImageRequests = new ArrayList<>();
    for(int i=0; i<productImageUrls.length; i++){
      ProductImageRequest productImageRequest = ProductImageRequest.builder()
          .url(productImageUrls[i])
          .build();
      if( i == 0){
        productImageRequest.setIsMain(true);
      }
      productImageRequests.add(productImageRequest);
    }
    return productImageRequests;
  }

  private void initProduct(){
    String[] colorName = {"red", "green", "blue"};
    String[] sizeName = {"S", "M", "L"};
    List<String[]> productImageUrls = List.of(
        new String[]{
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9ae59d2a8c6249c9a3b1fefc31a9d595_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_21_model.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/eee54ffa0f4f4bb882a55744633cf1c2_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_23_hover_model.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/8b7b7f14ecd8432886292b5b53f3f86d_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_25_model.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/341ec36583354390854e7ad4fd2a02dd_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_01_laydown.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/04f4cc4623fa4dcb9d25561a05ff1c90_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_41_detail.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/4538a0187d1247ef81d2e346f8bf5efb_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_42_detail.jpg"
        },
        new String[]{
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/8684b98162ce465cb85e96abc283115a_9366/Messi_Graphic_Tee_Black_JM8955_HM3.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/0559aad6a6b24dc985b0d3f9b03c8cce_9366/Messi_Graphic_Tee_Black_JM8955_HM1_hover.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/2ab01cc12f8b49b1a8cef25b62d72b81_9366/Messi_Graphic_Tee_Black_JM8955_HM4.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/530d00cc92ec416889db8eeb51761778_9366/Messi_Graphic_Tee_Black_JM8955_HM5.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/f822644d763245e4aa833c875c9c9b40_9366/Messi_Graphic_Tee_Black_JM8955_HM6.jpg",
        },
        new String[]{
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/f9cbb352de704effadd1ac0aeadd86f0_9366/Real_Madrid_Terrace_Icons_Jersey_Blue_JN3060_21_model.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/712e16eb21c0465086c4fc5d2160bad3_9366/Real_Madrid_Terrace_Icons_Jersey_Blue_JN3060_23_hover_model.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/f561360070824eb9b4da2063deacc958_9366/Real_Madrid_Terrace_Icons_Jersey_Blue_JN3060_25_model.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9ba726df59374aab898a45548275d8f6_9366/Real_Madrid_Terrace_Icons_Jersey_Blue_JN3060_01_laydown.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/85a4a6c2c27e495895d8c259d8c9fbd1_9366/Real_Madrid_Terrace_Icons_Jersey_Blue_JN3060_02_laydown.jpg"

        }
    );
    String[] productNames = {"Manchester United 25/26 Home Jersey", "Messi Graphic Tee", "Real Madrid Terrace Icons Jersey" };
    List<String> colorIds = new ArrayList<>();
    for (String color : colorName) {
      Optional<Color> isOpColor = colorRepository.findByName(color);
      if(isOpColor.isPresent()){
        return;
      } else {
        ColorRequest colorRequest = ColorRequest.builder().name(color).build();
        ColorResponse colorResponse = colorService.createColor(colorRequest);
        colorIds.add(colorResponse.getId());
      }
    }

    List<String> sizeIds = new ArrayList<>();
    for (String size : sizeName) {
      Optional<Size> isOpSize = sizeRepository.findByName(size);
      if(isOpSize.isPresent()){
        sizeIds.add(isOpSize.get().getId());
      }else {
        SizeRequest sizeRequest = SizeRequest.builder().name(size).build();
        SizeResponse sizeResponse = sizeService.createSize(sizeRequest);
        sizeIds.add(sizeResponse.getId());
      }
    }
    int count = 0;
    for (String productName: productNames ){
      List<ProductItemRequest> productItemRequests = new ArrayList<>();
      Boolean isActive = false;
      for(String colorId: colorIds){
        for(String sizeId: sizeIds) {
          long randomPrice = ThreadLocalRandom.current().nextLong(50_000, 150_001);
          ProductItemRequest productItemRequest = ProductItemRequest.builder()
              .colorId(colorId)
              .sizeId(sizeId)
              .price(BigDecimal.valueOf(randomPrice))
              .active(isActive)
              .quantity(1000L)
              .imageUrl(
                  "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/85a4a6c2c27e495895d8c259d8c9fbd1_9366/Real_Madrid_Terrace_Icons_Jersey_Blue_JN3060_02_laydown.jpg")
              .build();
          productItemRequests.add(productItemRequest);
          isActive = !isActive;
        }
      }
      List<ProductImageRequest> productImageRequests = createProductImages(productImageUrls.get(count));
      ProductRequest productRequest = ProductRequest.builder()
          .productName(productName)
          .description("Sản phẩm tự tạo của petd")
          .images(productImageRequests)
          .productItems(productItemRequests)
          .build();
      productService.createProduct(productRequest);
    }

  }
}
