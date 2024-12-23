package com.example.train.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.train.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.train.entity.Route;


import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Integer> {
    Page<Route> findAll(Pageable pageable);
    // Page<Route> findByNameContainingIgnoreCase(String stationName,Pageable pageable);
    Page<Route> findByStartStation_NameContainingIgnoreCase(String startStationName, Pageable pageable);

    List<Route> findByStartStationAndEndStation(Station startStation, Station endStation);
}
