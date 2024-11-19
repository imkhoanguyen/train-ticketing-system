package com.example.train.dto.response;

import java.io.Serializable;
import com.example.train.entity.Ticket;
import com.example.train.entity.Order;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OrderItemDetailResponse implements Serializable{
    private int id;
    private Ticket ticket;
    private Order order; 
}
