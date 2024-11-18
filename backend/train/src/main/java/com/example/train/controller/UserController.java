package com.example.train.controller;


import com.example.train.dto.request.PromotionRequestDto;
import com.example.train.dto.request.UserRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.dto.response.UserResponse;
import com.example.train.entity.Promotion;
import com.example.train.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //
@RequestMapping("api/user")
// được sử dụng để kích hoạt Spring Bean Validation.
// Mấy chỗ có đánh dấu @Valid là sử dụng cái này
@Validated
@Slf4j // ghi log
@Tag(name = "User Controller") // phân loại tên trong swagger
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/list")
    public ResponseData<?> GetAllWithLimit(
            @RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "1") int pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", defaultValue = "id,desc") String sortBy) {

        PageResponse<List<UserResponse>> response = userService.getAllWithLimit(pageNumber, pageSize, search, sortBy);

        return new ResponseData<>(HttpStatus.OK.value(), "get list user", response);
    }


    @PutMapping("/update/{id}")
    public ResponseData<?> updateUser(@PathVariable int id, @Valid @RequestBody UserRequestDto dto) {
        UserResponse res = userService.updateUser(id, dto);
        return new ResponseData<>(HttpStatus.OK.value(), "updated info successfully", res);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseData<String> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return new ResponseData<>(HttpStatus.OK.value(), "deleted user successfully");
    }

    @DeleteMapping("/reset-password/{id}")
    public ResponseData<String> adminResetPassword(@PathVariable int id, @RequestBody String password) {
        userService.resetPassword(id, password);
        return new ResponseData<>(HttpStatus.OK.value(), "reset password successfully");
    }
}
