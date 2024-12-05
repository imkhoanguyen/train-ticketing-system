package com.example.train.entity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "UserId", nullable = false)
    @JsonBackReference // Ngăn vòng lặp tuần tự hóa từ Order -> User -> Order
    private User user;

    @Enumerated(EnumType.STRING)  
    @Column(nullable = false)
    private OrderStatus status;  

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(nullable = false, length = 12)
    private String cmnd;

    @ManyToOne
    @JoinColumn(name = "promotionId", nullable = true)
    private Promotion promotion;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal subTotal;

    @Column(nullable = false)
    private LocalDateTime created = LocalDateTime.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Tuần tự hóa Order -> OrderItems nhưng không ngược lại
    private List<OrderItem> orderItems;
}

