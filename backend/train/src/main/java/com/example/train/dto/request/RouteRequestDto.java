package com.example.train.dto.request;

import java.io.Serializable;

public class RouteRequestDto implements Serializable{
    private String name;
    private int startStationId;  
    private int endStationId;    
    private boolean isDelete;

    public RouteRequestDto(String name, int startStationId, int endStationId, boolean isDelete) {
        this.name = name;
        this.startStationId = startStationId;
        this.endStationId = endStationId;
        this.isDelete = isDelete;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setStartStationId(int startStationId) { 
        this.startStationId = startStationId;
    }

    public void setEndStationId(int endStationId) { 
        this.endStationId = endStationId;
    }

    public void setDelete(boolean isDelete) {
        this.isDelete = isDelete;
    }

    public String getName() {
        return name;
    }

    public int getStartStationId() { // Sửa tên phương thức
        return startStationId;
    }

    public int getEndStationId() { // Sửa tên phương thức
        return endStationId;
    }

    public boolean isDelete() {  
        return isDelete;
    }
}
