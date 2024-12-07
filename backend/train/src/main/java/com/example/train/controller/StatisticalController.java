package com.example.train.controller;

import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.entity.Order;
import com.example.train.entity.Promotion;
import com.example.train.services.StatisticalService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
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
        return new ResponseData<>(HttpStatus.OK.value(), "get data chart", totalList);
    }

    @GetMapping("/list-order")
    public ResponseData<PageResponse<List<Order>>> GetListOder(
            @RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "1") int pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", defaultValue = "id,desc") String sortBy,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        // Parse start and end dates using OffsetDateTime
        OffsetDateTime start = startDate != null ? OffsetDateTime.parse(startDate) : null;
        OffsetDateTime end = endDate != null ? OffsetDateTime.parse(endDate) : null;

        // If you need to convert to LocalDateTime (for example, to remove the time zone info)
        LocalDateTime startDateTime = start != null ? start.toLocalDateTime() : null;
        LocalDateTime endDateTime = end != null ? end.toLocalDateTime() : null;
        PageResponse<List<Order>> response = (PageResponse<List<Order>>) statisticalService.GetOrder(pageNumber, pageSize, search, sortBy, startDateTime, endDateTime);
        return new ResponseData<>(HttpStatus.OK.value(), "get list order with limit", response);
    }

    @GetMapping("/total-user-today")
    public ResponseData<?> GetTotalUserToday() {
        int total = statisticalService.getNewUserToDay();
        return new ResponseData<>(HttpStatus.OK.value(), "get total user today success", total);
    }
}
