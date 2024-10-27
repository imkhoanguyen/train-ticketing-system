package com.example.train.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.train.entity.Promotion;

public interface PromotionRepository extends JpaRepository<Promotion,Integer>{
    
}
