package com.example.train.services;

// import com.example.train.dto.request.UserRequestDto;
import com.example.train.dto.request.LoginRequestDto;
import com.example.train.dto.request.RegisterRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.UserDetailResponse;
import com.example.train.dto.response.UserResponse;
import com.example.train.entity.User;

import java.util.List;


public interface UserService {

    void updateUser(int userId, User user);
    void deleteUser(int userId);

    PageResponse<List<UserResponse>> getAllWithLimit(int pageNo, int pageSize, String search, String sortBy);

    UserDetailResponse getUser(int userId);

    UserDetailResponse login(LoginRequestDto dto);
    UserDetailResponse register(RegisterRequestDto dto);
}
