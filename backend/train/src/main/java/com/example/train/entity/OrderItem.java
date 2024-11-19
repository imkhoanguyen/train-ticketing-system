package com.example.train.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @ManyToOne
    @JoinColumn(name = "ticketId", nullable = false)
    private Ticket ticket;

    @ManyToOne
    @JoinColumn(name = "orderId", nullable = false)
    @JsonBackReference // Ngăn vòng lặp từ OrderItem -> Order -> OrderItem
    private Order order;

}
