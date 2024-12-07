package com.example.train.services;

import java.math.BigDecimal;

import com.example.train.dto.request.OrderRequestDto;
import com.example.train.dto.response.OrderDetailResponse;
import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Order;
import com.example.train.entity.OrderStatus;

public interface OrderService {

    Order addOrder(OrderRequestDto orderRequestDto);
    void updateOrderPromotion(int orderId, int promotionId);
    void deleteOrder(int id);
    void restoreOrder(int id);

    void updateOrderSubtotal(int orderId, BigDecimal subTotal);

    PageResponse<?> getAllOrderAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy);
    PageResponse<?> getAllOrderByUserIdAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy,int id);

    OrderDetailResponse getOrderByUserId(int userId);

    OrderDetailResponse getOrderById(int id);

    void updateOrderStatus(int id, OrderStatus status);

} 
