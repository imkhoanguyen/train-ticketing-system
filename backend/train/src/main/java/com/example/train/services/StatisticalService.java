package com.example.train.services;

import java.math.BigDecimal;
import java.util.List;

public interface StatisticalService {
    int getTotalTicketToDay();
    List<BigDecimal> getTotalPriceOrderByYear(int year);
    BigDecimal getTotalPriceOrderToDay();
}
