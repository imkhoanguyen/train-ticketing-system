package com.example.train.services.implement;

import java.util.List;
import com.example.train.dto.request.RouteRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.RouteDetailResponse;
import com.example.train.entity.Route;
import com.example.train.entity.Station;
import com.example.train.repository.RouteRepository;
import com.example.train.repository.StationRepository;
import com.example.train.services.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
// import org.hibernate.mapping.Map;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RouteServicesImpl implements RouteService {

    private final RouteRepository routeRepository;
    private final StationRepository stationRepository;

    @Override
    public void addRoute(RouteRequestDto routeRequestDto) {
        Station startStation = stationRepository.findById(routeRequestDto.getStartStationId())
        .orElseThrow(() -> new IllegalArgumentException("Start station not found with id: " + routeRequestDto.getStartStationId()));

        Station endStation = stationRepository.findById(routeRequestDto.getEndStationId())
        .orElseThrow(() -> new IllegalArgumentException("End station not found with id: " + routeRequestDto.getEndStationId()));

        Route route = Route.builder()
                .name(routeRequestDto.getName())
                .startStation(startStation) 
                .endStation(endStation)     
                .isDelete(routeRequestDto.isDelete())
                .build();
        routeRepository.save(route);
    }

    @Override
    public void updateRoute(int id, RouteRequestDto routeRequestDto) {
        Station startStation = stationRepository.findById(routeRequestDto.getStartStationId())
        .orElseThrow(() -> new IllegalArgumentException("Start station not found with id: " + routeRequestDto.getStartStationId()));

        Station endStation = stationRepository.findById(routeRequestDto.getEndStationId())
        .orElseThrow(() -> new IllegalArgumentException("End station not found with id: " + routeRequestDto.getEndStationId()));


        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        route.setName(routeRequestDto.getName());
        route.setStartStation(startStation); 
        route.setEndStation(endStation);     
        route.setDelete(routeRequestDto.isDelete());
        routeRepository.save(route);
    }

    @Override
    public void deleteRoute(int id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        route.setDelete(true);
        routeRepository.save(route);
    }

    @Override
    public void restoreRoute(int id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        route.setDelete(false);
        routeRepository.save(route);
    }

    @Override
    public List<RouteDetailResponse> getAllRoute() {
        List<Route> routes = routeRepository.findAll();
        List<RouteDetailResponse> routeDetailResponses = routes.stream()
                .map(route -> {

                    return RouteDetailResponse.builder()
                                .id(route.getId())
                                .name(route.getName())
                                .startStation(route.getStartStation())
                                .endStation(route.getEndStation())
                                .isDelete(route.isDelete())
                            .build();
                })
                .toList();

        return routeDetailResponses;
    }



    @Override
    public RouteDetailResponse getRoute(int id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        return RouteDetailResponse.builder()
                .id(route.getId())
                .name(route.getName())
                .startStation(route.getStartStation())
                .endStation(route.getEndStation())
                .isDelete(route.isDelete())
                .build();
    }

    @Override
    public PageResponse<?> getAllRouteAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search,
            String sortBy) {
        int page = 0;
        if(pageNo > 0){
            page = pageNo - 1;
        }

        String sortField = sortBy.contains(",") ? sortBy.split(",")[0] : sortBy;
        String sortDirection = sortBy.endsWith("desc") ? "desc" : "asc";

        Sort sort = "desc".equalsIgnoreCase(sortDirection)
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<Route> routePage;
        if(search == null || search.isEmpty()){
            routePage = routeRepository.findAll(pageable);
        } else {
            routePage = routeRepository.findByStartStation_NameContainingIgnoreCase(search, pageable);
        }

        return PageResponse.<List<Route>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(routePage.getTotalElements())
                .items(routePage.getContent())
                .build();
    }
}
