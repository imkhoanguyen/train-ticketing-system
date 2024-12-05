package com.example.train.services;

import java.util.Optional;

import com.example.train.dto.request.OrderRequestDto;
import com.example.train.dto.response.OrderDetailResponse;
import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Order;

public interface OrderService {

    Order addOrder(OrderRequestDto orderRequestDto);
    void updateOrder(int id, OrderRequestDto orderRequestDto);
    void deleteOrder(int id);
    void restoreOrder(int id);

    PageResponse<?> getAllOrderAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy);
    PageResponse<?> getAllOrderByUserIdAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy,int id);

    OrderDetailResponse getOrderByUserId(int userId);

} 
