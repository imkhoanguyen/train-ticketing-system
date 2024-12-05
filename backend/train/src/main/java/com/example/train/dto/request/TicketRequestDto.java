package com.example.train.dto.request;
import java.time.LocalDateTime;

import com.example.train.entity.TicketStatus;

import java.math.BigDecimal;
import java.io.Serializable;

public class TicketRequestDto implements Serializable{
    private int schedules_id;
    private int seat_id;
    private LocalDateTime dateBuy;
    private TicketStatus status;
    private String object;
    private String fullname;
    private String can_cuoc;
    private int promotion_id; 
    private BigDecimal price;
    private BigDecimal price_reduced;

    public TicketRequestDto(int schedules_id, int seat_id, LocalDateTime dateBuy,TicketStatus status,
                            String object,String fullname,String can_cuoc,int promotion_id,BigDecimal price,
                            BigDecimal price_reduced) {

        this.schedules_id = schedules_id;
        this.seat_id = seat_id;
        this.dateBuy = dateBuy;
        this.status = status;
        this.object = object;
        this.fullname = fullname;
        this.can_cuoc = can_cuoc;
        this.promotion_id = promotion_id;
        this.price = price;
        this.price_reduced = price_reduced;

    }

    public void setSchedules_id(int schedules_id) {
        this.schedules_id = schedules_id;
    }

    public void setSeat_id(int seat_id) {
        this.seat_id = seat_id;
    }
    public void setDateBuy(LocalDateTime dateBuy) {
        this.dateBuy = dateBuy;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }
    public void setObject(String object) {
        this.object = object;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
    public void setCan_cuoc(String can_cuoc) {
        this.can_cuoc = can_cuoc;
    }

    public void setPromotion_id(int promotion_id) {
        this.promotion_id = promotion_id;
    }
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setPrice_reduced(BigDecimal price_reduced) {
        this.price_reduced = price_reduced;
    }

    public int getSchedules_id() { 
        return schedules_id;
    }

    public int getSeat_id() {  
        return seat_id;
    }
    public LocalDateTime getDateBuy() { 
        return dateBuy;
    }

    public TicketStatus getStatus() {  
        return status;
    }
    public String getObject() { 
        return object;
    }

    public String getFullname() {  
        return fullname;
    }
    public String getCan_cuoc() { 
        return can_cuoc;
    }

    public int getPromotion_id() {  
        return promotion_id;
    }
    public BigDecimal getPrice() { 
        return price;
    }

    public BigDecimal getPrice_reduced() {  
        return price_reduced;
    }

}
