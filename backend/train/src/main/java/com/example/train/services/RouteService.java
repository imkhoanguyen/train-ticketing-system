package com.example.train.services;

import java.util.List;

import com.example.train.dto.request.RouteRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.RouteDetailResponse;

public interface RouteService {
    void addRoute(RouteRequestDto routeRequestDto);

    void updateRoute(int id, RouteRequestDto routeRequestDto);
    void deleteRoute(int id);
    void restoreRoute(int id);
    
    List<RouteDetailResponse> getAllRoute();
    RouteDetailResponse getRoute(int id);
    PageResponse<?> getAllRouteAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy);
    List<RouteDetailResponse> getRoutesByStations(int startStationId, int endStationId);
}