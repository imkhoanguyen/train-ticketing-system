package com.example.train.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.train.entity.Carriage;

@Repository
public interface CarriageRepository extends JpaRepository<Carriage,Integer>{
    List<Carriage> findByTrainId(int trainId);
    
} 