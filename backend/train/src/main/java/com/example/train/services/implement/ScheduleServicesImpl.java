package com.example.train.services.implement;
import java.util.List;
import com.example.train.dto.request.ScheduleRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ScheduleDetailResponse;
import com.example.train.entity.Route;
import com.example.train.entity.Schedule;
import com.example.train.entity.Train;
import com.example.train.repository.RouteRepository;
import com.example.train.repository.ScheduleRepository;
import com.example.train.repository.TrainRepository;
import com.example.train.services.ScheduleService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScheduleServicesImpl implements ScheduleService {
    private final RouteRepository routeRepository;
    private final ScheduleRepository scheduleRepository;
    private final TrainRepository trainRepository;

    @Override
    public void addSchedule(ScheduleRequestDto schelduleRequestDto) {
        Route route = routeRepository.findById(schelduleRequestDto.getRouteId())
        .orElseThrow(() -> new IllegalArgumentException("route not found with id: " + schelduleRequestDto.getRouteId()));

        Train train = trainRepository.findById(schelduleRequestDto.getTrainId())
        .orElseThrow(() -> new IllegalArgumentException("End station not found with id: " + schelduleRequestDto.getTrainId()));
        Schedule schedule = Schedule.builder()
                .isDeleted(schelduleRequestDto.getIsDeleted())
                .price(schelduleRequestDto.getPrice())
                .route(route)
                .train(train)
                .startDate(schelduleRequestDto.getStartDate())
                .endDate(schelduleRequestDto.getEndDate())
                .build();
                scheduleRepository.save(schedule);
    }

    @Override
    public void updateSchedule(int id, ScheduleRequestDto schelduleRequestDto) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        Train train = trainRepository.findById(schelduleRequestDto.getTrainId())
        .orElseThrow(() -> new IllegalArgumentException("End station not found with id: " + schelduleRequestDto.getTrainId()));

        schedule.setTrain(train);
        schedule.setPrice(schelduleRequestDto.getPrice());
        schedule.setDeleted(schelduleRequestDto.getIsDeleted());
        schedule.setStartDate(schelduleRequestDto.getStartDate()); 
        schedule.setEndDate(schelduleRequestDto.getEndDate());    
        scheduleRepository.save(schedule);
    }

    @Override
    public void deleteSchedule(int id) {
        Schedule schedule = scheduleRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Schedule not found"));

        schedule.setDeleted(true);
        scheduleRepository.save(schedule);
    }

    @Override
    public void restoreSchedule(int id) {
        Schedule schedule = scheduleRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Schedule not found"));

        schedule.setDeleted(false);
        scheduleRepository.save(schedule);
    }

    @Override
    public ScheduleDetailResponse getSchedule(int id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        
        return ScheduleDetailResponse.builder()
                .id(schedule.getId())
                .price(schedule.getPrice())
                .isDeleted(schedule.isDeleted())
                .route(schedule.getRoute())
                .train(schedule.getTrain())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .build();
    }

    @Override
    public PageResponse<?> getAllScheduleAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search,
            String sortBy,int id) {
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

        Page<Schedule> schedulePage;
        if(search == null || search.isEmpty()){
            schedulePage = scheduleRepository.findAllByRouteId(id,pageable);
        } else {
            schedulePage = scheduleRepository.findByTrainNameContainingIgnoreCaseAndRouteId(search, pageable,id);
        }

        return PageResponse.<List<Schedule>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(schedulePage.getTotalElements())
                .items(schedulePage.getContent())
                .build();
    }

    
    
}
