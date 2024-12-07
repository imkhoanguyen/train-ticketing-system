package com.example.train.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.train.dto.request.OrderItemRequestDto;
import com.example.train.dto.response.ResponseData;
import com.example.train.entity.OrderItem;
import com.example.train.services.OrderItemService;

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

    @PostMapping("/add")
    public ResponseEntity<ResponseData<?>> addOrderItem(@Validated @RequestBody OrderItemRequestDto orderItemRequestDto) {
        OrderItem orderItem =  orderItemService.addOrderItem(orderItemRequestDto);
        ResponseData<?> responseData = new ResponseData<>(HttpStatus.OK.value(), "add orderItem success", orderItem);
        return ResponseEntity.ok(responseData);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData<?>> deleteOrderItem(@PathVariable int id) {
        orderItemService.deleteOrderItem(id);
        ResponseData<?> responseData = new ResponseData<>(HttpStatus.OK.value(), "delete orderItem success", null);
        return ResponseEntity.ok(responseData);
    }
}
