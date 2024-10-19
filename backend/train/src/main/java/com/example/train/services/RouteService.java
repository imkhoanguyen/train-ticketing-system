package com.example.train.services;

import java.util.List;

import com.example.train.dto.request.RouteRequestDto;
import com.example.train.dto.response.RouteDetailResponse;

public interface RouteService {
    void addRoute(RouteRequestDto routeRequestDto);

    void updateRoute(int id, RouteRequestDto routeRequestDto);
    void deleteRoute(int id);
    void restoreRoute(int id);
    
    List<RouteDetailResponse> getAllRoute();
    RouteDetailResponse getRoute(int id);
    
} 