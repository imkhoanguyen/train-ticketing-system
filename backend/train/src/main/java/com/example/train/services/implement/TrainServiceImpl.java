package com.example.train.services.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.train.dto.response.TrainDetailResponse;

import com.example.train.entity.Train;
import com.example.train.repository.TrainRepository;
import com.example.train.services.TrainService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TrainServiceImpl implements TrainService{
    private final TrainRepository trainRepository;
    @Override
    public List<TrainDetailResponse> getAllTrains() {
        List<Train> trains = trainRepository.findAll();

        List<TrainDetailResponse> trainResponses = trains.stream()
                .map(train -> TrainDetailResponse.builder()
                        .id(train.getId())
                        .name(train.getName())
                        .description(train.getDescription())
                        .pictureUrl(train.getPictureUrl())
                        .is_delete(train.isDelete())
                        .build())
                .toList();

        return trainResponses;
    }
    
}
