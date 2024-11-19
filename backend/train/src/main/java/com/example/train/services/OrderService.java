package com.example.train.services;

import com.example.train.dto.request.OrderRequestDto;
import com.example.train.dto.response.PageResponse;

public interface OrderService {
    void updateOrder(int id, OrderRequestDto orderRequestDto);
    void deleteOrder(int id);
    void restoreOrder(int id);

    PageResponse<?> getAllOrderAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy);
} 
