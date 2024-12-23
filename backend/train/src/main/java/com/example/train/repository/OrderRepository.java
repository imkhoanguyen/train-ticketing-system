package com.example.train.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import com.example.train.repository.custom.CustomOrderRepository;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.train.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer>, CustomOrderRepository {
    Page<Order> findAll(Pageable pageable);
    Page<Order> findByFullNameContainingIgnoreCase(String fullName,Pageable pageable);

    Page<Order> findByUserId(int userId, Pageable pageable);
    Page<Order> findByCreatedBetweenAndUserId(LocalDateTime startOfDay, LocalDateTime endOfDay, int userId, Pageable pageable);
    Page<Order> findByCreatedBetween(LocalDateTime startOfDay, LocalDateTime endOfDay, Pageable pageable);
    Page<Order> findByFullNameContainingIgnoreCaseAndCreatedBetween(String search, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    Optional<Order> findById(int id);
    Optional<Order> findByUserId(int userId);
}
