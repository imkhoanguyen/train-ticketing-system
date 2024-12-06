package com.example.train.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "scheduleId", nullable = false)
    private Schedule schedule;

    @ManyToOne
    @JoinColumn(name = "returnScheduleId", nullable = true) 
    private Schedule returnSchedule; //Danh cho ve khu hoi


    @ManyToOne
    @JoinColumn(name = "seatId",  nullable = false)
    private Seat seat;
    private String seatName;

    @ManyToOne
    @JoinColumn(name = "returnSeatId",  nullable = true)
    private Seat returnSeat;
    private String returnSeatName;

    private LocalDateTime dateBuy;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    private String objectDiscount;
    
    private String fullName;

    private String cmnd;

    private BigDecimal price; // price schedules + price seat - priceDiscount

    @ManyToOne
    @JoinColumn(name = "discountId", nullable = true)
    private Discount discount;

    private BigDecimal priceDiscount;

    @Builder.Default
    private Boolean isDelete = false;

}
