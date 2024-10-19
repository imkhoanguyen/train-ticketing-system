package com.example.train.dto.request;


import java.io.Serializable;
import java.time.LocalDateTime;

public class ScheduleRequestDto implements Serializable{
    private int trainId;
    private int routeId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public ScheduleRequestDto(int trainId, int routeId,LocalDateTime startDate,LocalDateTime endDate) {
        this.trainId = trainId;
        this.routeId = routeId;
        this.startDate = startDate;
        this.endDate = endDate;
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
