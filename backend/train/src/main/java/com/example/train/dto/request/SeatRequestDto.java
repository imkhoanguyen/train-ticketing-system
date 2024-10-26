package com.example.train.dto.request;
import java.io.Serializable;
import java.math.BigDecimal;

public class SeatRequestDto implements Serializable{
    private int carriageId;
    private String name;
    private BigDecimal price;
    private String description;  
    private boolean isDelete;

    public SeatRequestDto(int carriageId,String name, BigDecimal price,String description,boolean isDelete) {
        this.carriageId = carriageId;
        this.name = name;
        this.price = price;
        this.description = description;
        this.isDelete = isDelete;
    }

    public void setCarriageId(int carriageId) {
        this.carriageId = carriageId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDelete(boolean isDelete) {
        this.isDelete = isDelete;
    }

    public int getCarriageId() {
        return carriageId;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getDescription() { 
        return description;
    }
    
    public boolean isDelete() {  
        return isDelete;
    }
}
