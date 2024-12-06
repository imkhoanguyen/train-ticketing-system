package com.example.train.controller;

import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.entity.Promotion;
import com.example.train.services.StatisticalService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("api/statistical")
@Slf4j
@Validated
@Tag(name = "Statistical Controller")
@RequiredArgsConstructor
public class StatisticalController {
    private final StatisticalService statisticalService;

    @GetMapping("/total-price-today")
    public ResponseData<?> GetTotalPriceToday() {
        BigDecimal total = statisticalService.getTotalPriceOrderToDay();
        return new ResponseData<>(HttpStatus.OK.value(), "get total price today success", total);
    }

    @GetMapping("/total-ticket-today")
    public ResponseData<?> GetTotalTicketToday() {
        int total = statisticalService.getTotalTicketToDay();
        return new ResponseData<>(HttpStatus.OK.value(), "get total ticket today success", total);
    }

    @GetMapping("/data-chart")
    public ResponseData<?> GetDataChart(@RequestParam(value = "year", defaultValue = "2024") int year) {
        List<BigDecimal> totalList = statisticalService.getTotalPriceOrderByYear(year);
        return new ResponseData<>(HttpStatus.OK.value(), "get total price today success", totalList);
    }
}
