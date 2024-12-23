package com.example.train.dto.response;

import java.io.Serializable;
import com.example.train.entity.Station;
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

    private boolean isDelete;

}
