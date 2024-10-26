package com.example.train.services;

import java.util.List;

import com.example.train.dto.request.TrainRequestDto;
import com.example.train.dto.response.TrainDetailResponse;

public interface TrainService {
    List<TrainDetailResponse> getAllTrains();

    TrainDetailResponse getTrain(int id);
    void addTrain(TrainRequestDto trainRequestDto);
    void addMultiTrains (List<TrainRequestDto> trainRequestDtos);
    void updateTrain(int id, TrainRequestDto trainRequestDto);
    void deleteTrain(int id);
    void restoreTrain(int id);


}
