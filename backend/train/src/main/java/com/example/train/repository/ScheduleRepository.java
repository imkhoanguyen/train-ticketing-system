package com.example.train.repository;

import com.example.train.entity.Route;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.example.train.entity.Schedule;

import io.lettuce.core.dynamic.annotation.Param;
@Repository
public interface ScheduleRepository extends JpaRepository<Schedule,Integer> {
    List<Schedule> findByRouteId(int routeId);
    Page<Schedule> findAllByRouteId(int routeId, Pageable pageable);
    Page<Schedule> findByTrainNameContainingIgnoreCaseAndRouteId(String trainName,Pageable pageable,int id);
    @Query("SELECT s FROM Schedule s WHERE s.route.id = :routeId AND DATE(s.startDate) = :startDate")
List<Schedule> findByRouteIdAndStartDate(@Param("routeId") int routeId, @Param("startDate") LocalDate startDate);
} 

