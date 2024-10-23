package com.example.train.services.implement;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.train.dto.request.CarriageRequestDto;
import com.example.train.dto.response.CarriageDetailResponse;

import com.example.train.entity.Carriage;

import com.example.train.entity.Train;
import com.example.train.repository.CarriageRepository;
import com.example.train.repository.TrainRepository;
import com.example.train.services.CarriageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
// ghi log
@Slf4j
// khởi tạo bean UserRepository
@RequiredArgsConstructor
public class CarriageServiceImpl implements CarriageService {
    private final CarriageRepository carriageRepository;
    private final TrainRepository trainRepository;
    @Override
    public void addCarriage(CarriageRequestDto carriageRequestDto) {
        Carriage carriage = Carriage.builder()
            .name(carriageRequestDto.getName()) 
            .trainId(carriageRequestDto.getTrainId())
            .description(carriageRequestDto.getDescription())     
            .isDelete(carriageRequestDto.isDelete())
            .build();
            carriageRepository.save(carriage);
    }

    @Override
    public void updateCarriage(int id, CarriageRequestDto carriageRequestDto) {
        Carriage carriage = carriageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        carriage.setName(carriageRequestDto.getName());
        carriage.setTrainId(carriageRequestDto.getTrainId());
        carriage.setDescription(carriageRequestDto.getDescription()); 
        carriage.setDelete(carriageRequestDto.isDelete());    
        carriageRepository.save(carriage);
    }

    @Override
    public void deleteCarriage(int id) {
        Carriage carriage = carriageRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("carriage not found with id: " + id));

        carriage.setDelete(true); 

        carriageRepository.save(carriage);
        log.info("carriage deleted (set as inactive): {}", carriage);
    }

    @Override
    public void restoreCarriage(int id) {
        Carriage carriage = carriageRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("carriage not found with id: " + id));

        carriage.setDelete(false); 

        carriageRepository.save(carriage);
        log.info("carriage restored (set as active): {}", carriage);
    }

    @Override
    public List<CarriageDetailResponse> getAllCarriagesByTrainId(int id) {
        List<Carriage> carriages = carriageRepository.findByTrainId(id);

        List<Train> trains = trainRepository.findAll();


        Map<Integer, String> trainMap = trains.stream()
                .collect(Collectors.toMap(Train::getId, Train::getName));

        List<CarriageDetailResponse> carriageDetailResponses = carriages.stream()
                .map(carriage -> {
                    String trainName = trainMap.get(carriage.getTrainId());

                    return CarriageDetailResponse.builder()
                            .id(carriage.getId())
                            .name(carriage.getName())
                            .trainId(carriage.getTrainId()) 
                            .description(carriage.getDescription())
                            .is_delete(carriage.isDelete())
                            .trainName(trainName) 
                            .build();
                })
                .toList();

        return carriageDetailResponses;
    }

    @Override
    public CarriageDetailResponse getCarriage(int id) {
        Carriage carriage = carriageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carriage not found"));
        
        List<Train> trains = trainRepository.findAll();
        
        
        Map<Integer, String> trainMap = trains.stream()
                .collect(Collectors.toMap(Train::getId, Train::getName));
        
        String trainName = trainMap.get(carriage.getTrainId());
        
        return CarriageDetailResponse.builder()
                .id(carriage.getId())
                .name(carriage.getName())
                .trainId(carriage.getTrainId())
                .description(carriage.getDescription())
                .is_delete(carriage.isDelete())
                .trainName(trainName) 
                .build();
    }
    
}
