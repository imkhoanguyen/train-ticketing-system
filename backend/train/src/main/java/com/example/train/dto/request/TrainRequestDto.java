package com.example.train.dto.request;

import java.io.Serializable;

public class TrainRequestDto implements Serializable{
    private String name;
    private String description;  
    private String pictureUrl;    
    private boolean isDelete;

    public TrainRequestDto(String name, String description, String pictureUrl, boolean isDelete) {
        this.name = name;
        this.description = description;
        this.pictureUrl = pictureUrl;
        this.isDelete = isDelete;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) { 
        this.description = description;
    }

    public void setPictureUrl(String pictureUrl) { 
        this.pictureUrl = pictureUrl;
    }

    public void setDelete(boolean isDelete) {
        this.isDelete = isDelete;
    }

    public String getName() {
        return name;
    }

    public String getDescription() { // Sửa tên phương thức
        return description;
    }

    public String getPictureUrl() { // Sửa tên phương thức
        return pictureUrl;
    }

    public boolean isDelete() {  
        return isDelete;
    }
}
