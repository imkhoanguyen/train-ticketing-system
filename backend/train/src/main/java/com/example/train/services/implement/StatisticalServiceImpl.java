package com.example.train.services.implement;

import com.example.train.repository.OrderRepository;
import com.example.train.repository.TicketRepository;
import com.example.train.services.StatisticalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
@RequiredArgsConstructor
@Service
public class StatisticalServiceImpl implements StatisticalService {
    private  final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;

    @Override
    public int getTotalTicketToDay() {
        return ticketRepository.getCountTicketToDay();
    }

    @Override
    public List<BigDecimal> getTotalPriceOrderByYear(int year) {
        List<BigDecimal> totalPriceList = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            BigDecimal monthlyTotal = orderRepository.findMonthlyTotal(year, month);
            totalPriceList.add(monthlyTotal != null ? monthlyTotal : BigDecimal.ZERO);
        }

        return totalPriceList;
    }

    @Override
    public BigDecimal getTotalPriceOrderToDay() {
        return orderRepository.getTotalToDay();
    }
}
