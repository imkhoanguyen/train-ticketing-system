package com.example.train.dto.request;
import java.io.Serializable;

public class OrderRequestDto implements Serializable{
    private int user_id;
    private String status;

    public OrderRequestDto(int user_id, String status) {
        this.user_id = user_id;
        this.status = status;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getUser_id() { 
        return user_id;
    }

    public String getStatus() {  
        return status;
    }
}
