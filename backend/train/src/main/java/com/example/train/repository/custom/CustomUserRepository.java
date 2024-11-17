package com.example.train.repository.custom;

import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.UserResponse;

import java.util.List;

public interface CustomUserRepository {
    PageResponse<List<UserResponse>> findAllWithCustomQuery(int pageNo, int pageSize, String search, String sortBy);
}

