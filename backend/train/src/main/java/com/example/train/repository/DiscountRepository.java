package com.example.train.repository;

import com.example.train.entity.Discount;
import com.example.train.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Integer> {
    Page<Discount> findAllByIsDeleteFalse(Pageable pageable);
    Page<Discount> findByObjectContainingIgnoreCaseAndIsDeleteFalse(String name, Pageable pageable);
    List<Discount> findAllByIsDeleteFalse();
}
