package com.example.train.services;

import com.example.train.dto.response.UserDetailResponse;
import org.springframework.security.core.Authentication;

public interface TokenService {
    String CreateToken(UserDetailResponse dto);
    Authentication validateToken(String token);
}
