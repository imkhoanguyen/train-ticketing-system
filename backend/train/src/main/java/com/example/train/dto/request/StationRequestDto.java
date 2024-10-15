package com.example.train.dto.request;
import java.io.Serializable;

public class StationRequestDto implements Serializable{
    private String name;
    private boolean isDelete;
   

    public StationRequestDto(String name, boolean isDelete) {
        this.name = name;
        this.isDelete = isDelete;
        
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIsDelete(boolean isDelete) {
        this.isDelete = isDelete;
    }

    public String getName() {
        return name;
    }

    public boolean getIsDelete() {
        return isDelete;
    }

    
}
