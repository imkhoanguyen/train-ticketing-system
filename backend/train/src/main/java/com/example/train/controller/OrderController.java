package com.example.train.controller;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.train.dto.response.ResponseData;
import com.example.train.services.OrderService;

import io.swagger.v3.oas.annotations.Operation;
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
    
    @Operation(summary = "Get list of Order per pageNo", description = "Send a request via this API to get route list by pageNo and pageSize")
    @GetMapping("/list")
    public ResponseData<?> getAllOrder() {
        log.info("Request get all order");
        return new ResponseData<>(HttpStatus.OK.value(), "order", orderService.getAllOrder());
        
    }
}
