package com.example.train.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.train.entity.Train;

@Repository
public interface TrainRepository extends JpaRepository<Train,Integer>{
    Page<Train> findAll(Pageable pageable);
    Page<Train> findByNameContainingIgnoreCase(String stationName,Pageable pageable);
    
}
