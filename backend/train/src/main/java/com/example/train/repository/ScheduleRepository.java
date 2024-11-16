package com.example.train.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.example.train.entity.Schedule;
@Repository
public interface ScheduleRepository extends JpaRepository<Schedule,Integer> {
    List<Schedule> findByRouteId(int routeId);
    Page<Schedule> findAllByRouteId(int routeId, Pageable pageable);
    Page<Schedule> findByTrainNameContainingIgnoreCaseAndRouteId(String trainName,Pageable pageable,int id);
} 
