package com.example.train.dto.response;

import java.io.Serializable;
import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class SeatDetailResponse implements Serializable{
    private int id;
    private int carriageId;
    private String name;
    private BigDecimal price;
    private String description;
    private boolean is_delete;
    
    private String carriageName;
}
