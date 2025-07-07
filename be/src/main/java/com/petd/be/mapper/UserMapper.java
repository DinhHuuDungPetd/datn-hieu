package com.petd.be.mapper;

import com.petd.be.dto.request.UserRequest;
import com.petd.be.dto.response.UserResponse;
import com.petd.be.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

  User toUser(UserRequest userRequest);
  UserResponse userToUserResponse(User user);

}
