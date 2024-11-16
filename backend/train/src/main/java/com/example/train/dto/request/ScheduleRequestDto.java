package com.example.train.dto.request;


import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ScheduleRequestDto implements Serializable{
    private boolean isDeleted;
    private BigDecimal price;
    private int trainId;
    private int routeId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public ScheduleRequestDto(boolean isDeleted,BigDecimal price,int trainId, 
                int routeId,LocalDateTime startDate,LocalDateTime endDate) {
        this.isDeleted=isDeleted;
        this.price=price;
        this.trainId = trainId;
        this.routeId = routeId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public void setIsDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setTrainId(int trainId) {
        this.trainId = trainId;
    }

    public void setRouteId(int routeId) {
        this.routeId = routeId;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public boolean getIsDeleted() {
        return isDeleted;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getTrainId() {
        return trainId;
    }

    public int getRouteId() {
        return routeId;
    }
    public LocalDateTime getStartDate() {
        return startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }
}
