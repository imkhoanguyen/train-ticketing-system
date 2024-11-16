package com.example.train.controller;

import com.example.train.dto.request.LoginRequestDto;
import com.example.train.dto.request.RegisterRequestDto;
import com.example.train.dto.response.ResponseData;
import com.example.train.dto.response.UserDetailResponse;
import com.example.train.services.TokenService;
import com.example.train.services.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth")
@Slf4j
@Validated
@Tag(name = "Auth Controller")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseData<?> login(@Valid @RequestBody LoginRequestDto dto) {
        UserDetailResponse u = userService.login(dto);
        u.setToken(tokenService.CreateToken(u));
        return new ResponseData<>(HttpStatus.OK.value(), "login success", u);
    }

    @PostMapping("/register")
    public ResponseData<?> register(@Valid @RequestBody RegisterRequestDto dto) {
        UserDetailResponse u = userService.register(dto);
        u.setToken(tokenService.CreateToken(u));
        return new ResponseData<>(HttpStatus.CREATED.value(), "register success", u);
    }
}
