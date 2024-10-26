package com.example.train.services;


import java.util.List;
import com.example.train.dto.request.CarriageRequestDto;
import com.example.train.dto.response.CarriageDetailResponse;

public interface CarriageService {
    void addCarriage(CarriageRequestDto carriageRequestDto);

    void updateCarriage(int id, CarriageRequestDto carriageRequestDto);
    void deleteCarriage(int id);
    void restoreCarriage(int id);
    
    List<CarriageDetailResponse> getAllCarriagesByTrainId(int id);
    CarriageDetailResponse getCarriage(int id);
    
} 
