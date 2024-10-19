package com.example.train.services;

import java.util.List;

import com.example.train.dto.response.TrainDetailResponse;

public interface TrainService {
    List<TrainDetailResponse> getAllTrains();
}
