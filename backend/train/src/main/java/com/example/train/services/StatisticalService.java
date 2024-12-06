package com.example.train.services;

import com.example.train.dto.response.PageResponse;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface StatisticalService {
    int getTotalTicketToDay();
    List<BigDecimal> getTotalPriceOrderByYear(int year);
    BigDecimal getTotalPriceOrderToDay();
    PageResponse<?> GetOrder(int pageNo, int pageSize, String search,
                             String sortBy, LocalDateTime startDate, LocalDateTime endDate);
}
