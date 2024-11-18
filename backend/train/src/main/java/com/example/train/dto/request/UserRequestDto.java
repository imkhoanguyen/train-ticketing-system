package com.example.train.dto.request;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserRequestDto implements Serializable {
    private int id;
    private String userName;
    private String fullName;
    private String email;
    private String phone;
    private String cmnd;
}
