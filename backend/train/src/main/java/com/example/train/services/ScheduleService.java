package com.example.train.services;

import java.util.List;

import com.example.train.dto.request.ScheduleRequestDto;
import com.example.train.dto.response.ScheduleDetailResponse;

public interface ScheduleService {
    void addSchedule(ScheduleRequestDto schelduleRequestDto);

    void updateSchedule(int id, ScheduleRequestDto schelduleRequestDto);
    void deleteSchedule(int id);
    void restoreSchedule(int id);
    
    List<ScheduleDetailResponse> getAllSchedulesByRouteId(int id);
    ScheduleDetailResponse getSchedule(int id);
    
} 
