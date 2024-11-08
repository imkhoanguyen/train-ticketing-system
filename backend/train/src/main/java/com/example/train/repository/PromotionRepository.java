package com.example.train.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.train.entity.Promotion;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion,Integer>{
    Page<Promotion> findAllByIsDeleteFalse(Pageable pageable);
    Page<Promotion> findByNameContainingIgnoreCaseAndIsDeleteFalse(String name, Pageable pageable);
}
