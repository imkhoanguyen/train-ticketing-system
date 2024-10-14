package com.example.train.dto.response;

// import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Builder
public class UserDetailResponse implements Serializable {
    private int id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String cmnd;
}
