package com.example.train.dto.request;
import java.io.Serializable;


public class OrderItemRequestDto implements Serializable{
    private int ticket_id;
    private int order_id;

    public OrderItemRequestDto(int ticket_id, int order_id) {
        this.ticket_id = ticket_id;
        this.order_id = order_id;
    }

    public void setTicket_id(int ticket_id) {
        this.ticket_id = ticket_id;
    }

    public void setOrder_id(int order_id) {
        this.order_id = order_id;
    }

    public int getTicket_id() { 
        return ticket_id;
    }

    public int getOrder_id() {  
        return order_id;
    }
}
