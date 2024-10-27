package com.example.train.services;

import java.util.List;
import com.example.train.dto.request.OrderRequestDto;
import com.example.train.dto.response.OrderDetailResponse;

public interface OrderService {
    void updateOrder(int id, OrderRequestDto orderRequestDto);
    void deleteOrder(int id);
    void restoreOrder(int id);
    
    List<OrderDetailResponse> getAllOrder();
    
} 
