package com.example.train.services.implement;

import java.util.List;

import org.springframework.stereotype.Service;


import com.example.train.dto.request.TrainRequestDto;
import com.example.train.dto.response.TrainDetailResponse;
import com.example.train.entity.Train;
import com.example.train.repository.TrainRepository;
import com.example.train.services.TrainService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
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
    @Override
    public void addTrain(TrainRequestDto trainRequestDto) {
        Train train = Train.builder()
        .name(trainRequestDto.getName())
        .description(trainRequestDto.getDescription())
        .pictureUrl(trainRequestDto.getPictureUrl())
        .isDelete(trainRequestDto.isDelete())
        .build();

        // Lưu station vào database
        trainRepository.save(train);
        log.info("Train added successfully: {}", train);
    }

    @Override
    public TrainDetailResponse getTrain(int id) {
        Train train = trainRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Train not found with ID: " + id));

        return TrainDetailResponse.builder()
                .id(train.getId())
                .name(train.getName())
                .description(train.getDescription())
                .pictureUrl(train.getPictureUrl())
                .is_delete(train.isDelete())
                .build();
    }

    @Override
    public void updateTrain(int id, TrainRequestDto trainRequestDto) {
        Train train = trainRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Train not found with ID: " + id));

        train.setName(trainRequestDto.getName());
        train.setDescription(trainRequestDto.getDescription());
        train.setPictureUrl(trainRequestDto.getPictureUrl());
        train.setDelete(trainRequestDto.isDelete());

        trainRepository.save(train);
        log.info("Train updated successfully: {}", train);
    }
    @Override
    public void deleteTrain(int id) {
        Train train = trainRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Train not found with id: " + id));

            train.setDelete(true); 
            trainRepository.save(train);
            log.info("Train deleted (set as deleted): {}", train);
    }
    @Override
    public void restoreTrain(int id) {
        Train train = trainRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Train not found with id: " + id));

        train.setDelete(false); 

        trainRepository.save(train);
        log.info("Train restored (set as active): {}", train);
    }
    @Override
    public void addMultiTrains(List<TrainRequestDto> trainRequestDtos) {
        List<Train> trains = trainRequestDtos.stream()
        .map(dto -> Train.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .pictureUrl(dto.getPictureUrl())
                .isDelete(dto.isDelete())
                .build())
        .toList();

        trainRepository.saveAll(trains);
        log.info("Trains added successfully: {}", trains);
    }
    
    
}