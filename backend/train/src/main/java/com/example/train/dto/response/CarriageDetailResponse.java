package com.example.train.dto.response;

import java.io.Serializable;
import com.example.train.entity.Train;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class CarriageDetailResponse implements Serializable{
    private int id;
    private String name;
    private Train train;
    private String description;
    private boolean isDelete;
    
}
