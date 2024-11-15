package com.example.train.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
// Tạo ra một Builder Pattern cho lớp, giúp xây dựng đối tượng một cách linh hoạt.
@Builder
// tạo ra constructor ko có tham số
@NoArgsConstructor
// tạo ra constructor với tất cả tham số
@AllArgsConstructor
@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;

    private String password;

    private String fullName;

    private String email;

    private String phone;

    private String cmnd;

    @Builder.Default
    private boolean isDelete = false;

    private String role;
}