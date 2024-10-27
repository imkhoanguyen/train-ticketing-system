package com.example.train.services;

import java.util.List;

import com.example.train.dto.response.OrderItemDetailResponse;

public interface OrderItemService {
    List<OrderItemDetailResponse> getAllOrderItems(int order_id);
}
