package com.example.train.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDto {
    @NotBlank(message = "UserName cannot be empty")
    String userName;
    @NotBlank(message = "Password cannot be empty")
    String password;
}
