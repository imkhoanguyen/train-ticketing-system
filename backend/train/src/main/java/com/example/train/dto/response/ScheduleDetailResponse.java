package com.example.train.dto.response;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.example.train.entity.Route;
import com.example.train.entity.Train;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ScheduleDetailResponse implements Serializable{
    private int id;
    private int trainId;
    private int routeId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Route route;
    private Train train;
    // private String trainName; // Tên station khởi đầu
    // private String routeName;
}
