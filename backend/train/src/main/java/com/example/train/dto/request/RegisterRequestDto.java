package com.example.train.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequestDto {
    @NotBlank(message = "UserName cannot be empty")
    private String userName;
    @NotBlank(message = "Password cannot be empty")
    private String password;
    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email should be valid")
    private String email;
    @NotBlank(message = "Phone cannot be empty")
    @Pattern(regexp = "^(03|05|07|08|09)\\d{8}$", message = "Phone should be a valid Vietnamese phone number")
    private String phone;
    @NotBlank(message = "CMND cannot be empty")
    @Pattern(regexp = "^(\\d{9}|\\d{12})$", message = "CMND must be either 9 or 12 digits")
    private String cmnd;
    @NotBlank(message = "FullName cannot be empty")
    private String fullName;
}
