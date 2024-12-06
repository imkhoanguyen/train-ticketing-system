package com.example.train.services.implement;


import org.springframework.stereotype.Service;
import com.example.train.repository.OrderItemRepository;
import com.example.train.repository.OrderRepository;
import com.example.train.repository.TicketRepository;
import com.example.train.dto.request.OrderItemRequestDto;
import com.example.train.entity.Order;
import com.example.train.entity.OrderItem;
import com.example.train.entity.Ticket;
import com.example.train.exception.NotFoundException;
import com.example.train.services.OrderItemService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
// ghi log
@Slf4j
@Transactional
// khởi tạo bean UserRepository
@RequiredArgsConstructor
public class OrderItemServiceImpl implements OrderItemService{
    private final OrderItemRepository orderItemRepository;
    private final TicketRepository ticketRepository;
    private final OrderRepository  orderRepository;

    @Override
    public void addOrderItem(OrderItemRequestDto orderItemRequestDto) {
        Order order = orderRepository.findById(orderItemRequestDto.getOrder_id())
            .orElseThrow(() -> new NotFoundException("Order không tìm thấy"));

    Ticket ticket = ticketRepository.findById(orderItemRequestDto.getTicket_id())
            .orElseThrow(() -> new NotFoundException("Ticket không tìm thấy"));

            ;
    OrderItem orderItem = OrderItem.builder()
            .order(order)
            .ticket(ticket)
            .build();

    orderItemRepository.save(orderItem);

    // Cập nhật tổng giá trị của Order
    order.setSubTotal(order.getSubTotal().add(ticket.getPrice()));
    orderRepository.save(order);
    }
}
