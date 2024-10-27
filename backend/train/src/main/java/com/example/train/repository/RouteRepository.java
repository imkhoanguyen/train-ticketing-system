package com.example.train.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.train.entity.Route;
@Repository
public interface RouteRepository extends JpaRepository<Route, Integer> {
}
