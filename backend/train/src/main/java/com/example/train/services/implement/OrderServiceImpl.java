package com.example.train.services.implement;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.example.train.dto.request.OrderRequestDto;
import com.example.train.dto.response.OrderDetailResponse;
import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Order;
import com.example.train.entity.OrderItem;
import com.example.train.entity.OrderStatus;
import com.example.train.entity.Promotion;
import com.example.train.entity.Ticket;
import com.example.train.entity.User;
import com.example.train.exception.NotFoundException;
import com.example.train.repository.OrderRepository;
import com.example.train.repository.PromotionRepository;
import com.example.train.repository.UserRepository;
import com.example.train.services.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
// ghi log
@Slf4j
// khởi tạo bean UserRepository
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PromotionRepository promotionRepository;

    @Override
    public Order addOrder(OrderRequestDto orderRequestDto) {
        User user = userRepository.findById(orderRequestDto.getUser_id())
                .orElseThrow(() -> new NotFoundException("User không tìm thấy"));
        
        LocalDateTime now = LocalDateTime.now();
        
        Order order = Order.builder()
                .user(user)
                .status(orderRequestDto.getStatus())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .cmnd(user.getCmnd())
                .promotion(null)
                .subTotal(BigDecimal.ZERO) 
                .created(now)
                .build();

        return orderRepository.save(order); 
    }

    @Override
    public OrderDetailResponse getOrderByUserId(int userId) {
        Order order = orderRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Order không tìm thấy"));

        return OrderDetailResponse.builder()
                .id(order.getId())
                .promotion(order.getPromotion())
                .subTotal(order.getSubTotal())
                .created(order.getCreated())
                .cmnd(order.getCmnd())
                .phone(order.getPhone())
                .fullName(order.getFullName())
                .status(OrderStatus.PENDING)
                .orderItems(order.getOrderItems())
                .build();
    }

    @Override
    public void updateOrderPromotion(int orderId, int promotionId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order không tìm thấy"));

        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new NotFoundException("Promotion không tìm thấy"));

        BigDecimal subTotal = order.getSubTotal().compareTo(BigDecimal.ZERO) > 0 
                ? order.getSubTotal().subtract(promotion.getPrice()) 
                : BigDecimal.ZERO;


        order.setPromotion(promotion);
        order.setSubTotal(subTotal);

        orderRepository.save(order);
        log.info("Order updated: {}", order);
    }

    @Override
    public void updateOrderStatus(int id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order không tìm thấy"));

        order.setStatus(status);

        orderRepository.save(order);
        log.info("Order updated: {}", order);
    }

    @Override
    public OrderDetailResponse getOrderById(int id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order không tìm thấy"));

        return OrderDetailResponse.builder()
                .id(order.getId())
                .promotion(order.getPromotion())
                .subTotal(order.getSubTotal())
                .created(order.getCreated())
                .cmnd(order.getCmnd())
                .phone(order.getPhone())
                .fullName(order.getFullName())
                .status(OrderStatus.PENDING)
                .orderItems(order.getOrderItems())
                .build();
    }


    @Override
    public void deleteOrder(int id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order không tìm thấy"));

        orderRepository.delete(order);
        log.info("Order deleted: {}", order);
    }

    @Override
    public void restoreOrder(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'restoreOrder'");
    }

    @Override
    public PageResponse<?> getAllOrderAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search,
            String sortBy) {
        int page = 0;
        if(pageNo > 0){
            page = pageNo - 1;
        }

        String sortField = sortBy.contains(",") ? sortBy.split(",")[0] : sortBy;
        String sortDirection = sortBy.endsWith("desc") ? "desc" : "asc";

        Sort sort = "desc".equalsIgnoreCase(sortDirection)
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<Order> orderPage;
        if(search == null || search.isEmpty()){
            orderPage = orderRepository.findAll(pageable);
        } else {
            orderPage = orderRepository.findByFullNameContainingIgnoreCase(search, pageable);
        }

        return PageResponse.<List<Order>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(orderPage.getTotalElements())
                .items(orderPage.getContent())
                .build();
    }

    @Override
    public PageResponse<?> getAllOrderByUserIdAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search,
            String sortBy, int id) {
        int page = (pageNo > 0) ? pageNo - 1 : 0;

        String sortField = sortBy.contains(",") ? sortBy.split(",")[0] : sortBy;
        String sortDirection = sortBy.endsWith("desc") ? "desc" : "asc";

        Sort sort = "desc".equalsIgnoreCase(sortDirection)
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<Order> orderPage;

        if (search == null || search.isEmpty()) {
            orderPage = orderRepository.findByUserId(id, pageable);
        } else {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                LocalDateTime startOfDay = LocalDate.parse(search, formatter).atStartOfDay();
                LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);

                orderPage = orderRepository.findByCreatedBetweenAndUserId(startOfDay, endOfDay, id, pageable);
            } catch (Exception e) {
                throw new IllegalArgumentException("Ngày không hợp lệ. Vui lòng nhập đúng định dạng dd/MM/yyyy");
            }
        }

        return PageResponse.<List<Order>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(orderPage.getTotalElements())
                .items(orderPage.getContent())
                .build();
    }

    
}
