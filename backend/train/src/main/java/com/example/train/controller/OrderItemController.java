package com.example.train.controller;

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
    
}
