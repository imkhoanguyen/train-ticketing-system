package com.example.train.services.implement;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.train.dto.request.CarriageRequestDto;
import com.example.train.dto.response.CarriageDetailResponse;
import com.example.train.dto.response.PageResponse;
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
        Train train = trainRepository.findById(carriageRequestDto.getTrainId())
        .orElseThrow(() -> new IllegalArgumentException("End station not found with id: " + carriageRequestDto.getTrainId()));
       Carriage carriage = Carriage.builder()
           .name(carriageRequestDto.getName())
           .train(train)
           .description(carriageRequestDto.getDescription())
           .isDelete(carriageRequestDto.isDelete())
           .build();
           carriageRepository.save(carriage);
    }

    @Override
    public void updateCarriage(int id, CarriageRequestDto carriageRequestDto) {
        Train train = trainRepository.findById(carriageRequestDto.getTrainId())
            .orElseThrow(() -> new IllegalArgumentException("End station not found with id: " + carriageRequestDto.getTrainId()));
       Carriage carriage = carriageRepository.findById(id)
               .orElseThrow(() -> new RuntimeException("Route not found"));
       carriage.setName(carriageRequestDto.getName());
       carriage.setTrain(train);
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
        List<CarriageDetailResponse> carriageDetailResponses = carriages.stream()
                .map(carriage -> {

                    return CarriageDetailResponse.builder()
                            .id(carriage.getId())
                            .name(carriage.getName())
                            .train(carriage.getTrain())
                            .description(carriage.getDescription())
                            .isDelete(carriage.isDelete())
                            .build();
                })
                .toList();

        return carriageDetailResponses;
    }

    @Override
    public CarriageDetailResponse getCarriage(int id) {
        Carriage carriage = carriageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carriage not found"));

        return CarriageDetailResponse.builder()
                .id(carriage.getId())
                .name(carriage.getName())
                .train(carriage.getTrain())
                .description(carriage.getDescription())
                .isDelete(carriage.isDelete())
                .build();
    }

    @Override
    public PageResponse<?> getAllCarriageAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search,
            String sortBy, int id) {
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

        Page<Carriage> carriagePage;
        if(search == null || search.isEmpty()){
            carriagePage = carriageRepository.findAllByTrainId(id,pageable);
        } else {
            carriagePage = carriageRepository.findByNameContainingIgnoreCaseAndTrainId(search, pageable,id);
        }

        return PageResponse.<List<Carriage>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(carriagePage.getTotalElements())
                .items(carriagePage.getContent())
                .build();
    }
    
}
