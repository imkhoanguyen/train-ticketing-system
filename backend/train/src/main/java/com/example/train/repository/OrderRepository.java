package com.example.train.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.train.entity.Order;
@Repository
public interface OrderRepository extends JpaRepository<Order,Integer>{
    
}
