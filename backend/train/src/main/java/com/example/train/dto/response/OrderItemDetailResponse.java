package com.example.train.dto.response;
import java.io.Serializable;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OrderItemDetailResponse implements Serializable{
    private int id;
    private int ticket_id;
    private int order_id; 
}
