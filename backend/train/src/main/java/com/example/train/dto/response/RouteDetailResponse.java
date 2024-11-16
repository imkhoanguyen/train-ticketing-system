package com.example.train.dto.response;

import java.io.Serializable;

import com.example.train.entity.Station;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RouteDetailResponse implements Serializable {
    private int id;
    private String name;

    private Station startStation;
    private Station endStation;

    @JsonProperty("is_delete")
    private boolean isDelete;

}
