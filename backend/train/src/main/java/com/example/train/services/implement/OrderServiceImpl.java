package com.example.train.services.implement;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.AbstractMap.SimpleEntry;
import java.util.Map.Entry;

import org.springframework.stereotype.Service;

import com.example.train.dto.request.OrderRequestDto;
import com.example.train.dto.response.OrderDetailResponse;
import com.example.train.entity.Order;

import com.example.train.entity.User;
import com.example.train.repository.OrderRepository;
import com.example.train.repository.UserRepository;
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
    private final UserRepository userRepository;
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
    public List<OrderDetailResponse> getAllOrder() {

        List<Order> orders  = orderRepository.findAll();
       
        List<User> users= userRepository.findAll();
     
        Map<Integer, Entry<String, String>> userMap = users.stream()
                .collect(Collectors.toMap(
                        User::getId,
                        user -> new SimpleEntry<>(user.getFullName(), user.getPhone())
                ));
        
        List<OrderDetailResponse> orderDetailResponses = orders.stream()
                .map(order -> {
                    Entry<String, String> userInfo = userMap.get(order.getUser_id());
                    String fullName = userInfo.getKey();
                    String phone = userInfo.getValue();
                    
                    return OrderDetailResponse.builder()
                            .id(order.getId())      
                            .user_id(order.getUser_id())
                            .status(order.getStatus())

                            .fullname(fullName)
                            .phone(phone)
                            .build();
                })
                .toList();

        return orderDetailResponses;
    }
    
}
