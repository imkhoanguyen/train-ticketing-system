package com.example.train.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.example.train.entity.Seat;

@Repository
public interface SeatRepository extends JpaRepository<Seat,Integer>{
    List<Seat> findByCarriageId(int carriageId);
    
} 
