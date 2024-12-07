package com.example.train.controller;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.train.dto.request.OrderRequestDto;
import com.example.train.dto.response.OrderDetailResponse;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.entity.Order;
import com.example.train.entity.OrderStatus;
import com.example.train.entity.Schedule;
import com.example.train.entity.TicketStatus;
import com.example.train.services.OrderService;
import com.example.train.services.ScheduleService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/order")
@Validated
@Slf4j
@Tag(name = "Order Controller")                           
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    @GetMapping("/list")
    public ResponseData<PageResponse<List<Order>>> GetAllWithLimit(
            @RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "1") int pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", defaultValue = "id,desc") String sortBy) {
            
        PageResponse<List<Order>> response = (PageResponse<List<Order>>) orderService.getAllOrderAndSearchWithPagingAndSorting(pageNumber, pageSize, search, sortBy);

        return new ResponseData<>(HttpStatus.OK.value(), "get list discount with limit", response);
    }

    @GetMapping("/list/{id}")
    public ResponseData<PageResponse<List<Order>>> GetAllByUserIdWithLimit(
            @RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "1") int pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", defaultValue = "id,desc") String sortBy,
            @PathVariable int id) {
            
        PageResponse<List<Order>> response = (PageResponse<List<Order>>) orderService.getAllOrderByUserIdAndSearchWithPagingAndSorting(pageNumber, pageSize, search, sortBy,id);

        return new ResponseData<>(HttpStatus.OK.value(), "get list discount with limit", response);
    }

    @PostMapping("/add")
    public ResponseEntity<ResponseData<Order>> AddOrder(@RequestBody OrderRequestDto orderRequestDto) {
        Order addedOrder = orderService.addOrder(orderRequestDto); 
        ResponseData<Order> responseData = new ResponseData<>(HttpStatus.CREATED.value(), "Order added successfully", addedOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
    }


    // @GetMapping("get/{userId}")
    // public ResponseData<OrderDetailResponse> GetOrderByUserId(@PathVariable int userId) {
    //     OrderDetailResponse response = orderService.getOrderByUserId(userId);

    //     return new ResponseData<>(HttpStatus.OK.value(), "get order by user id", response);
    // }
    @PutMapping("/updateStatus/{id}/{status}")
    public ResponseEntity<ResponseData<Order>> UpdateOrderStatus(@PathVariable int id, @PathVariable OrderStatus status) {
        orderService.updateOrderStatus(id, status);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Order status updated successfully", null));
    }

    @PutMapping("/updatePromotion/{orderId}/{promotionId}")
    public ResponseEntity<ResponseData<Order>> UpdateOrderPromotion(@PathVariable int orderId, @PathVariable int promotionId) {
        orderService.updateOrderPromotion(orderId, promotionId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Order promotion updated successfully", null));
    }

    @GetMapping("/get/{id}")
    public ResponseData<OrderDetailResponse> GetOrderById(@PathVariable int id) {
        System.out.println("iddddddddddddddđ: " + id);
        OrderDetailResponse response = orderService.getOrderById(id);

        return new ResponseData<>(HttpStatus.OK.value(), "get order by id", response);
    }
    @DeleteMapping("/delele/{id}")
    public ResponseEntity<ResponseData<Order>> DeleteOrder(@PathVariable int id) {
        orderService.deleteOrder(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Order deleted successfully", null));
    }

    @PutMapping("/updateSubtotal/{orderId}/{subTotal}")
    public ResponseEntity<ResponseData<Order>> UpdateOrderSubtotal(@PathVariable int orderId, @PathVariable BigDecimal subTotal) {
        orderService.updateOrderSubtotal(orderId, subTotal);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Order subtotal updated successfully", null));
    }
}
