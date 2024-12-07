package com.example.train.services.implement;

import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Order;
import com.example.train.repository.OrderRepository;
import com.example.train.repository.TicketRepository;
import com.example.train.repository.UserRepository;
import com.example.train.services.StatisticalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@RequiredArgsConstructor
@Service
public class StatisticalServiceImpl implements StatisticalService {
    private  final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

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

    @Override
    public PageResponse<?> GetOrder(int pageNo, int pageSize, String search,
                                    String sortBy, LocalDateTime startDate, LocalDateTime endDate) {
        int page = 0;
        if(pageNo > 0){
            page = pageNo - 1;
        }

        String sortField = sortBy.contains(",") ? sortBy.split(",")[0] : sortBy;
        String sortDirection = sortBy.endsWith("desc") ? "desc" : "asc";

        Sort sort = "desc".equalsIgnoreCase(sortDirection)
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        if (startDate != null) {
            startDate = startDate.toLocalDate().atStartOfDay();
        }

        if (endDate != null) {
            endDate = endDate.toLocalDate().atTime(23, 59, 59, 999999);  // Set time to 23:59:59
        }

        Page<Order> orderPage;
        if (search == null || search.isEmpty()) {
            if (startDate != null && endDate != null) {
                orderPage = orderRepository.findByCreatedBetween(startDate, endDate, pageable);
            } else {
                orderPage = orderRepository.findAll(pageable);
            }
        } else {
            if (startDate != null && endDate != null) {
                orderPage = orderRepository.findByFullNameContainingIgnoreCaseAndCreatedBetween(search, startDate, endDate, pageable);
            } else {
                orderPage = orderRepository.findByFullNameContainingIgnoreCase(search, pageable);
            }
        }

        return PageResponse.<List<Order>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(orderPage.getTotalElements())
                .items(orderPage.getContent())
                .build();
    }

    @Override
    public int getNewUserToDay() {
        return userRepository.getUserRegisterToDay();
    }
}
