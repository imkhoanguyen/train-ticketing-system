package com.example.train.controller;


import com.example.train.dto.response.ResponseData;
import com.example.train.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController //
@RequestMapping("/user")
// được sử dụng để kích hoạt Spring Bean Validation.
// Mấy chỗ có đánh dấu @Valid là sử dụng cái này
@Validated
@Slf4j // ghi log
@Tag(name = "User Controller") // phân loại tên trong swagger
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @Operation(summary = "Get list of users per pageNo", description = "Send a request via this API to get user list by pageNo and pageSize")
    @GetMapping("/list")
    public ResponseData<?> getAllUsers(@RequestParam(defaultValue = "0", required = false) int pageNumber,
                                       @Min(10) @RequestParam(defaultValue = "20", required = false) int pageSize,
                                       @RequestParam(required = false) String sortBy) {
        log.info("Request get all of users");
        return new ResponseData<>(HttpStatus.OK.value(), "users", userService.getAll(pageNumber, pageSize));
    }
}
