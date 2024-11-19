package com.example.train.dto.response;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.example.train.entity.OrderItem;
import com.example.train.entity.Promotion;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OrderDetailResponse implements Serializable{
    // private User user;
    private int id;
    // private UserResponse user;
    private Promotion promotion;
    private BigDecimal subTotal;
    private LocalDateTime created;
    private String cmnd;
    private String phone;
    private String fullName;
    private String status;
    private List<OrderItem> orderItems;
}
