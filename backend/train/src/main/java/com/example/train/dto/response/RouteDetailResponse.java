package com.example.train.dto.response;

import java.io.Serializable;

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
    private int startStationId;
    private int endStationId;

    @JsonProperty("is_delete")
    private boolean isDelete;

    private String startStationName; // Tên station khởi đầu
    private String endStationName;
}
