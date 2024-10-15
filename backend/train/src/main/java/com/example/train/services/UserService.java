package com.example.train.services;

// import com.example.train.dto.request.UserRequestDto;
import com.example.train.dto.response.UserDetailResponse;
import com.example.train.entity.User;

import java.util.List;

public interface UserService {

    int addUser(User user);
    void updateUser(int userId, User user);
    void deleteUser(int userId);

    List<UserDetailResponse> getAll(int pageNumber, int pageSize);

    UserDetailResponse getUser(int userId);
}
