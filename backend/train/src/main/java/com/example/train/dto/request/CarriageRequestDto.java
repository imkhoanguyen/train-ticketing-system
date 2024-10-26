package com.example.train.dto.request;
import java.io.Serializable;

public class CarriageRequestDto implements Serializable{
    private String name;
    private int trainId;
    private String description;  
    private boolean isDelete;

    public CarriageRequestDto(String name, int trainId,String description,boolean isDelete) {
        this.name = name;
        this.trainId = trainId;
        this.description = description;
        this.isDelete = isDelete;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTrainId(int trainId) {
        this.trainId = trainId;
    }


    public void setDescription(String description) {
        this.description = description;
    }

    public void setDelete(boolean isDelete) {
        this.isDelete = isDelete;
    }

    public String getName() {
        return name;
    }

    public int getTrainId() {
        return trainId;
    }

    public String getDescription() { // Sửa tên phương thức
        return description;
    }
    
    public boolean isDelete() {  
        return isDelete;
    }
}
