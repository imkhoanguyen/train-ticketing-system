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
@Table(name = "ticket")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "schedules_id",nullable = false)
    private int schedules_id;

    @Column(name = "seat_id", nullable = false)
    private int seat_id;

    @Column(name = "dateBuy")
    private LocalDateTime dateBuy;

    @Column(name = "status")  
    private String status;

    @Column(name = "object") 
    private String object;
    
    @Column(name = "fullname") 
    private String fullname;

    @Column(name = "can_cuoc") 
    private String can_cuoc;

    @Column(name = "promotion_id") 
    private int promotion_id;
    
    @Column(name = "price") 
    private BigDecimal price;

    @Column(name = "price_reduced") 
    private BigDecimal price_reduced;

    @Transient
    private String seatName;

    @Transient
    private String promotionName;

    @Transient
    private LocalDateTime startDate;

    @Transient
    private LocalDateTime endDate;

    @Transient
    private String startStation;

    @Transient
    private String endStation;
}
