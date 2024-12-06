package com.example.train.dto.request;
import java.io.Serializable;

import com.example.train.entity.OrderStatus;
import com.example.train.entity.TicketStatus;

public class OrderRequestDto implements Serializable{
    private int user_id;
    private OrderStatus status;

    public OrderRequestDto(int user_id, OrderStatus status) {
        this.user_id = user_id;
        this.status = status;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public int getUser_id() { 
        return user_id;
    }

    public OrderStatus getStatus() {  
        return status;
    }
}
