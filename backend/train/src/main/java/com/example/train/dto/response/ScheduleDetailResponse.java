package com.example.train.dto.response;

import java.io.Serializable;
import java.math.BigDecimal;
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
    private boolean isDeleted;
    private BigDecimal price;
    private Route route;
    private Train train;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

}
