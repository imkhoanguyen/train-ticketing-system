package com.example.train.services;

import com.example.train.dto.request.OrderItemRequestDto;
import com.example.train.entity.OrderItem;

public interface OrderItemService {
    OrderItem addOrderItem(OrderItemRequestDto orderItemRequestDto);

    void deleteOrderItem(int id);
}
