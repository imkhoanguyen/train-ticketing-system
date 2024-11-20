package com.example.train.services.implement;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.example.train.dto.request.OrderRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Order;
import com.example.train.repository.OrderRepository;
import com.example.train.services.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
// ghi log
@Slf4j
// khởi tạo bean UserRepository
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{
    private final OrderRepository orderRepository;

    @Override
    public void updateOrder(int id, OrderRequestDto orderRequestDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateOrder'");
    }

    @Override
    public void deleteOrder(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteOrder'");
    }

    @Override
    public void restoreOrder(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'restoreOrder'");
    }

    @Override
    public PageResponse<?> getAllOrderAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search,
            String sortBy) {
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

        Page<Order> orderPage;
        if(search == null || search.isEmpty()){
            orderPage = orderRepository.findAll(pageable);
        } else {
            orderPage = orderRepository.findByFullNameContainingIgnoreCase(search, pageable);
        }

        return PageResponse.<List<Order>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(orderPage.getTotalElements())
                .items(orderPage.getContent())
                .build();
    }

    @Override
    public PageResponse<?> getAllOrderByUserIdAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search,
            String sortBy, int id) {
        int page = (pageNo > 0) ? pageNo - 1 : 0;

        String sortField = sortBy.contains(",") ? sortBy.split(",")[0] : sortBy;
        String sortDirection = sortBy.endsWith("desc") ? "desc" : "asc";

        Sort sort = "desc".equalsIgnoreCase(sortDirection)
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<Order> orderPage;

        if (search == null || search.isEmpty()) {
            orderPage = orderRepository.findByUserId(id, pageable);
        } else {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                LocalDateTime startOfDay = LocalDate.parse(search, formatter).atStartOfDay();
                LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);

                orderPage = orderRepository.findByCreatedBetweenAndUserId(startOfDay, endOfDay, id, pageable);
            } catch (Exception e) {
                throw new IllegalArgumentException("Ngày không hợp lệ. Vui lòng nhập đúng định dạng dd/MM/yyyy");
            }
        }

        return PageResponse.<List<Order>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(orderPage.getTotalElements())
                .items(orderPage.getContent())
                .build();
    }

    
}
