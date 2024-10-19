package com.example.train.dto.response;

import java.io.Serializable;
import java.time.LocalDateTime;

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

    private String trainName; // Tên station khởi đầu
    private String routeName;
}
