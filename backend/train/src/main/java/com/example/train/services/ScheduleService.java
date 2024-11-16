package com.example.train.services;

import com.example.train.dto.request.ScheduleRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ScheduleDetailResponse;

public interface ScheduleService {
    void addSchedule(ScheduleRequestDto schelduleRequestDto);
    void updateSchedule(int id, ScheduleRequestDto schelduleRequestDto);
    void deleteSchedule(int id);
    void restoreSchedule(int id);
    ScheduleDetailResponse getSchedule(int id);
    PageResponse<?> getAllScheduleAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy,int id);

    
} 
