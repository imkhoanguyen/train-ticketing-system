package com.example.train.dto.response;
import java.io.Serializable;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OrderDetailResponse implements Serializable{
    private int id;
    private int user_id;
    private String status;

    private String fullname;
    private String phone;
    
}
