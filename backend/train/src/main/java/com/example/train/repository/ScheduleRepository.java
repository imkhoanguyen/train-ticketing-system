package com.example.train.repository;

// import org.hibernate.mapping.List;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.example.train.entity.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule,Integer> {
    List<Schedule> findByRouteId(int routeId);
    
} 
