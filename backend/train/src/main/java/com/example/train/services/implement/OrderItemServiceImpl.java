package com.example.train.services.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.train.dto.response.OrderItemDetailResponse;
import com.example.train.entity.OrderItem;

import com.example.train.repository.OrderItemRepository;
import com.example.train.services.OrderItemService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
// ghi log
@Slf4j
// khởi tạo bean UserRepository
@RequiredArgsConstructor
public class OrderItemServiceImpl implements OrderItemService{
    private final OrderItemRepository orderItemRepository;
    @Override
    public List<OrderItemDetailResponse> getAllOrderItems(int order_id) {
       List<OrderItem> orderItems = orderItemRepository.findByOrderId(order_id);

        List<OrderItemDetailResponse> orderItemDetailResponses = orderItems.stream()
                .map(orderItem -> {
                    return OrderItemDetailResponse.builder()
                            .id(orderItem.getId())
                            .ticket_id(orderItem.getTicket_id())
                            .order_id(orderItem.getOrderId())
                            .build();
                })
                .toList();

        return orderItemDetailResponses;
    }
    
}
