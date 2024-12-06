package com.example.train.services;

import com.example.train.dto.request.OrderItemRequestDto;

public interface OrderItemService {
    void addOrderItem(OrderItemRequestDto orderItemRequestDto);
}
