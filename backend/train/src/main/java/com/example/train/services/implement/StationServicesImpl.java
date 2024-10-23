package com.example.train.services.implement;
import com.example.train.dto.request.StationRequestDto;
import com.example.train.dto.response.StationDetailResponse;
import com.example.train.entity.Station;
import com.example.train.repository.StationRepository;
import com.example.train.services.StationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
//định nghĩa tầng service
@Service
// ghi log
@Slf4j
// khởi tạo bean UserRepository
@RequiredArgsConstructor

public class StationServicesImpl implements StationService {
    private final StationRepository  stationRepository;

    @Override
    public void updateStation(int id, StationRequestDto stationRequestDto) {
        
        Station existingStation = stationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Station not found with ID: " + id));

        // Update the fields of the existing station with values from stationRequestDto
        existingStation.setName(stationRequestDto.getName());
        existingStation.set_delete(stationRequestDto.getIsDelete());

        // Save the updated station back to the database
        stationRepository.save(existingStation);
        log.info("Station updated successfully: {}", existingStation);
    }

    @Override
    public void deleteStation(int id) {
        Station station = stationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Station not found with id: " + id));

            // Update the is_delete status
            station.set_delete(true); // Set is_delete to true (1)
            
            // Save the updated station
            stationRepository.save(station);
            log.info("Station deleted (set as deleted): {}", station);
       
    }

    @Override
    public List<StationDetailResponse> getAllStation() {
        List<Station> stations = stationRepository.findAll();

        // Chuyển đổi danh sách Station thành danh sách StationDetailResponse
        List<StationDetailResponse> stationResponses = stations.stream()
                .map(station -> StationDetailResponse.builder()
                        .id(station.getId())
                        .name(station.getName())
                        .isDelete(station.is_delete())
                        .build())
                .toList();

        return stationResponses;
    }


    @Override
    public StationDetailResponse getStation(int id) {
        
        Station station = stationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Station not found with ID: " + id));

        return StationDetailResponse.builder()
                .id(station.getId())
                .name(station.getName())
                .isDelete(station.is_delete())
                .build();
    }

    @Override
    public void restoreStation(int id) {
        
        Station station = stationRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Station not found with id: " + id));

        // Update the is_delete status
        station.set_delete(false); // Set is_delete to false (0)

        // Save the updated station
        stationRepository.save(station);
        log.info("Station restored (set as active): {}", station);
    }

    @Override
    public void addStation(StationRequestDto stationRequestDto) {
        Station station = Station.builder()
        .name(stationRequestDto.getName())
        .is_delete(stationRequestDto.getIsDelete())
        .build();

        // Lưu station vào database
        stationRepository.save(station);
        log.info("Station added successfully: {}", station);
    }

    @Override
    public void addMultiStations(List<StationRequestDto> stationRequestDtos) {
        List<Station> stations = stationRequestDtos.stream()
        .map(dto -> Station.builder()
                .name(dto.getName())
                .is_delete(dto.getIsDelete())
                .build())
        .toList();

        stationRepository.saveAll(stations);
        log.info("Stations added successfully: {}", stations);
    }
    
}
