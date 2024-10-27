package com.example.train.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.train.dto.response.ResponseData;
import com.example.train.services.OrderItemService;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/orderItem")
@Validated
@Slf4j
@Tag(name = "Order item Controller")                           
@RequiredArgsConstructor
public class OrderItemController {
    private final OrderItemService orderItemService;
    
    @Operation(summary = "Get list of schedules", description = "Send a request via this API to get schedule list by pageNo and pageSize")
    @GetMapping("/list/{id}")
    public ResponseData<?> getAllOrderItemsByOrderId(@PathVariable int id) {
        log.info("Request get all stations");
        return new ResponseData<>(HttpStatus.OK.value(), "schedules", orderItemService.getAllOrderItems(id));
        
    }
}
