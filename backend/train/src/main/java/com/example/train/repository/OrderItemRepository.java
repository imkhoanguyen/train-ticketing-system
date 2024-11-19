package com.example.train.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.train.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem,Integer>{

}
