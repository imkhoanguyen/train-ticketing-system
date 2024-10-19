package com.example.train.controller;
import org.springframework.http.HttpStatus;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;



import com.example.train.dto.response.ResponseData;


import com.example.train.services.TrainService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("api/train")
@Validated
@Slf4j
@Tag(name = "Train Controller")                           
@RequiredArgsConstructor

public class TrainController {
    private final TrainService trainService;
    @Operation(summary = "Get list of trains per pageNo", description = "Send a request via this API to get route list by pageNo and pageSize")
    @GetMapping("/list")
    public ResponseData<?> getAllRoutes() {
        log.info("Request get all trains");
        return new ResponseData<>(HttpStatus.OK.value(), "routes", trainService.getAllTrains());
        
    }
}
