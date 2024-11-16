package com.example.train.dto.response;

// import jakarta.persistence.Column;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailResponse implements Serializable {
    private int id;
    private String userName;
    private String fullName;
    private String email;
    private String phone;
    private String cmnd;
    private String role;
    private String token;
}
