package com.example.train.dto.response;

import java.io.Serializable;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TrainDetailResponse implements Serializable{
    private int id;
    private String name;
    private String description;
    private String pictureUrl;
    private boolean isDelete;
}
