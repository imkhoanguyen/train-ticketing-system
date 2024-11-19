package com.example.train.dto.response;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TicketDetailResponse implements Serializable{
    private int id;
    private int schedules_id;
    private int seat_id;
    private LocalDateTime dateBuy;
    private String status;
    private String object;
    private String fullname;
    private String can_cuoc;
    private int promotion_id; 
    private BigDecimal price;
    private BigDecimal price_reduced;

    private String seatName;
    private String promotionName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String startStation;
    private String endStation;
}
