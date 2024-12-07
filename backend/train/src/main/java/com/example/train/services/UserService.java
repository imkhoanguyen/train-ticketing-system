package com.example.train.services;

// import com.example.train.dto.request.UserRequestDto;
import com.example.train.dto.request.LoginRequestDto;
import com.example.train.dto.request.RegisterRequestDto;
import com.example.train.dto.request.UserRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.UserDetailResponse;
import com.example.train.dto.response.UserResponse;

import java.util.List;


public interface UserService {

    UserResponse updateUser(int id, UserRequestDto dto);
    void deleteUser(int id);

    void resetPassword(int id, String password);

    PageResponse<List<UserResponse>> getAllWithLimit(int pageNo, int pageSize, String search, String sortBy);

    UserDetailResponse login(LoginRequestDto dto);
    UserDetailResponse register(RegisterRequestDto dto);
}
