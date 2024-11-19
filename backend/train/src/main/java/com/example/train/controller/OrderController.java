package com.example.train.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.entity.Order;
import com.example.train.services.OrderService;
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
}
