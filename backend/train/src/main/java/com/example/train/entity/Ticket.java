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
    @JoinColumn(name = "seatId",  nullable = false)
    private Seat seat;
    private String seatName;

    private LocalDateTime dateBuy;

    private String status;

    private String objectDiscount;
    
    private String fullName;

    private String cmnd;

    private BigDecimal price; // price schedules + price seat

    @ManyToOne
    @JoinColumn(name = "discountId", nullable = true)
    private Discount discount;

    private BigDecimal priceDiscount;

    @Builder.Default
    private Boolean isDelete = false;

}
