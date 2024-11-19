package com.example.train.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.train.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer>{
    Page<Order> findAll(Pageable pageable);
    Page<Order> findByFullNameContainingIgnoreCase(String fullName,Pageable pageable);
}
