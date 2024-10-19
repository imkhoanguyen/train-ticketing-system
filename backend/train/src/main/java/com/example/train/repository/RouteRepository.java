package com.example.train.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.train.entity.Route;

public interface RouteRepository extends JpaRepository<Route, Integer> {
}
