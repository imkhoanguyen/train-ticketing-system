package com.example.train.services.implement;

import java.util.List;
import java.util.Map;
import com.example.train.dto.request.RouteRequestDto;
import com.example.train.dto.response.RouteDetailResponse;
import com.example.train.entity.Route;
import com.example.train.entity.Station;
import com.example.train.repository.RouteRepository;
import com.example.train.repository.StationRepository;
import com.example.train.services.RouteService;

import lombok.RequiredArgsConstructor;
import java.util.stream.Collectors;

// import org.hibernate.mapping.Map;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RouteServicesImpl implements RouteService {

    private final RouteRepository routeRepository;
    private final StationRepository stationRepository;

    @Override
    public void addRoute(RouteRequestDto routeRequestDto) {
        Route route = Route.builder()
                .name(routeRequestDto.getName())
//                .startStationId(routeRequestDto.getStartStationId()) // Sử dụng đúng tên
//                .endStationId(routeRequestDto.getEndStationId())     // Sử dụng đúng tên
                .isDelete(routeRequestDto.isDelete())
                .build();
        routeRepository.save(route);
    }

    @Override
    public void updateRoute(int id, RouteRequestDto routeRequestDto) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        route.setName(routeRequestDto.getName());
//        route.setStartStationId(routeRequestDto.getStartStationId()); // Sử dụng đúng tên
//        route.setEndStationId(routeRequestDto.getEndStationId());     // Sử dụng đúng tên
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

        // Lấy danh sách tất cả các station
        List<Station> stations = stationRepository.findAll();
        Map<Integer, String> stationMap = stations.stream()
                .collect(Collectors.toMap(Station::getId, Station::getName));

        List<RouteDetailResponse> routeDetailResponses = routes.stream()
                .map(route -> {
                    // Lấy tên station tương ứng
//                    String startStationName = stationMap.get(route.getStartStationId());
//                    String endStationName = stationMap.get(route.getEndStationId());

                    return RouteDetailResponse.builder()
                            .id(route.getId())
                            .name(route.getName())
//                            .startStationId(route.getStartStationId())
//                            .endStationId(route.getEndStationId())
//                            .isDelete(route.isDelete())
//                            .startStationName(startStationName) // Thêm tên station khởi đầu
//                            .endStationName(endStationName)     // Thêm tên station kết thúc
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
//                .startStationId(route.getStartStationId())
//                .endStationId(route.getEndStationId())
                .isDelete(route.isDelete())
                .build();
    }
}
