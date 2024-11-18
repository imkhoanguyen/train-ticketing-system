package com.example.train.services;
import java.util.List;

import com.example.train.dto.request.StationRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.StationDetailResponse;

public interface  StationService {
    void addStation(StationRequestDto stationRequestDto);
    void addMultiStations (List<StationRequestDto> stationRequestDtos);
    
    void updateStation(int id, StationRequestDto stationRequestDto);
    void deleteStation(int id);
    void restoreStation(int id);
    
    List<StationDetailResponse> getAllStation();
    StationDetailResponse getStation(int id);
    PageResponse<?> getAllStationAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy);
}
