package com.example.train.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserResponse {
    private int id;
    private String userName;
    private String fullName;
    private String email;
    private String phone;
    private String cmnd;
    private String role;
}
