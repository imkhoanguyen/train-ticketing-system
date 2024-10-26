package com.example.train.dto.response;

import java.io.Serializable;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class CarriageDetailResponse implements Serializable{
    private int id;
    private String name;
    private int trainId;
    private String description;
    private boolean is_delete;
    
    private String trainName;
}
