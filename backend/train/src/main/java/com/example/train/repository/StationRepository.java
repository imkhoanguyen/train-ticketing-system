package com.example.train.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.train.entity.Station;

@Repository
public interface StationRepository extends JpaRepository<Station,Integer>{
    
}
