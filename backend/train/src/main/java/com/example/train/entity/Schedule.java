package com.example.train.entity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "trainId", nullable = false)
    private Train train;

    @ManyToOne
    @JoinColumn(name = "routeId", nullable = false)
    private Route route;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    private BigDecimal price;

    @Builder.Default
    private boolean isDeleted = false;
    private String routeName;
    private String trainName;
}
