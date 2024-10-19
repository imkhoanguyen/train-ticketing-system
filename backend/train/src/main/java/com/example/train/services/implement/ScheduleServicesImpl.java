package com.example.train.services.implement;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.example.train.dto.request.ScheduleRequestDto;
import com.example.train.dto.response.ScheduleDetailResponse;
import com.example.train.entity.Route;
import com.example.train.entity.Schedule;
import com.example.train.entity.Train;
import com.example.train.repository.RouteRepository;
import com.example.train.repository.ScheduleRepository;
import com.example.train.repository.TrainRepository;
import com.example.train.services.ScheduleService;

import lombok.RequiredArgsConstructor;


// import org.hibernate.mapping.Map;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScheduleServicesImpl implements ScheduleService {
    private final RouteRepository routeRepository;
    private final ScheduleRepository scheduleRepository;
    private final TrainRepository trainRepository;

    @Override
    public void addSchedule(ScheduleRequestDto schelduleRequestDto) {
        Schedule schedule = Schedule.builder()
                .trainId(schelduleRequestDto.getTrainId())
                .routeId(schelduleRequestDto.getRouteId()) 
                .startDate(schelduleRequestDto.getStartDate())     
                .endDate(schelduleRequestDto.getEndDate())
                .build();
                scheduleRepository.save(schedule);
    }

    @Override
    public void updateSchedule(int id, ScheduleRequestDto schelduleRequestDto) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        schedule.setTrainId(schelduleRequestDto.getTrainId());
        schedule.setStartDate(schelduleRequestDto.getStartDate()); 
        schedule.setEndDate(schelduleRequestDto.getEndDate());    
        scheduleRepository.save(schedule);
    }

    @Override
    public void deleteSchedule(int id) {
        Schedule schedule = scheduleRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Schedule not found"));

        scheduleRepository.delete(schedule);
    }

    @Override
    public void restoreSchedule(int id) {
        
    }

    
    @Override
    public List<ScheduleDetailResponse> getAllSchedulesByRouteId(int id) {
        List<Schedule> schedules = scheduleRepository.findByRouteId(id);

        List<Route> routes = routeRepository.findAll();
        List<Train> trains = trainRepository.findAll();

        Map<Integer, String> routeMap = routes.stream()
                .collect(Collectors.toMap(Route::getId, Route::getName));

        Map<Integer, String> trainMap = trains.stream()
                .collect(Collectors.toMap(Train::getId, Train::getName));

        List<ScheduleDetailResponse> scheduleDetailResponses = schedules.stream()
                .map(schedule -> {
                    String routeName = routeMap.get(schedule.getRouteId());
                    String trainName = trainMap.get(schedule.getTrainId());

                    return ScheduleDetailResponse.builder()
                            .id(schedule.getId())
                            .trainId(schedule.getTrainId())
                            .trainName(trainName)  
                            .routeId(schedule.getRouteId())
                            .routeName(routeName)  
                            .startDate(schedule.getStartDate())
                            .endDate(schedule.getEndDate())
                            .build();
                })
                .toList();

        return scheduleDetailResponses;
    }


    @Override
    public ScheduleDetailResponse getSchedule(int id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        
        List<Route> routes = routeRepository.findAll();
        List<Train> trains = trainRepository.findAll();
        
        Map<Integer, String> routeMap = routes.stream()
                .collect(Collectors.toMap(Route::getId, Route::getName));
        
        Map<Integer, String> trainMap = trains.stream()
                .collect(Collectors.toMap(Train::getId, Train::getName));
        
        String routeName = routeMap.get(schedule.getRouteId());
        String trainName = trainMap.get(schedule.getTrainId());
        
        return ScheduleDetailResponse.builder()
                .id(schedule.getId())
                .trainId(schedule.getTrainId())
                .trainName(trainName) 
                .routeId(schedule.getRouteId())
                .routeName(routeName)  
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .build();
    }

    
    
    
}
