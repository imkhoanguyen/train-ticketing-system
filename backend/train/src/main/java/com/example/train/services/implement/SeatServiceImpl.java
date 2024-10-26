package com.example.train.services.implement;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.train.dto.request.SeatRequestDto;
import com.example.train.dto.response.SeatDetailResponse;
import com.example.train.entity.Carriage;
import com.example.train.entity.Seat;
import com.example.train.repository.CarriageRepository;
import com.example.train.repository.SeatRepository;
import com.example.train.services.SeatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
// ghi log
@Slf4j
// khởi tạo bean UserRepository
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService{
    private final CarriageRepository carriageRepository;
    private final SeatRepository seatRepository;
    @Override
    public List<SeatDetailResponse> getAllSeatsByCarriageId(int id) {
        List<Seat> seats = seatRepository.findByCarriageId(id);

        List<Carriage> carriages = carriageRepository.findAll();


        Map<Integer, String> carriageMap = carriages.stream()
                .collect(Collectors.toMap(Carriage::getId, Carriage::getName));

        List<SeatDetailResponse> seatDetailResponses = seats.stream()
                .map(seat -> {
                    String carriageName = carriageMap.get(seat.getCarriageId());

                    return SeatDetailResponse.builder()
                            .id(seat.getId())
                            .carriageId(seat.getCarriageId())
                            .name(seat.getName())
                            .price(seat.getPrice()) 
                            .description(seat.getDescription())
                            .is_delete(seat.isDelete())
                            .carriageName(carriageName) 
                            .build();
                })
                .toList();

        return seatDetailResponses;
    }

    @Override
    public SeatDetailResponse getSeat(int id) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        
        List<Carriage> carriages = carriageRepository.findAll();
        
        
        Map<Integer, String> carriageMap = carriages.stream()
                .collect(Collectors.toMap(Carriage::getId, Carriage::getName));
        
        String carriageName = carriageMap.get(seat.getCarriageId());
        
        return SeatDetailResponse.builder()
                .id(seat.getId())
                .carriageId(seat.getCarriageId())
                .name(seat.getName())
                .price(seat.getPrice())
                .description(seat.getDescription())
                .is_delete(seat.isDelete())
                .carriageName(carriageName) 
                .build();
    }

    @Override
    public void addSeat(SeatRequestDto seatRequestDto) {
        Seat seat = Seat.builder()
            .carriageId(seatRequestDto.getCarriageId())
            .name(seatRequestDto.getName()) 
            .price(seatRequestDto.getPrice())
            .description(seatRequestDto.getDescription())     
            .isDelete(seatRequestDto.isDelete())
            .build();
            seatRepository.save(seat);
    }


    @Override
    public void updateSeat(int id, SeatRequestDto seatRequestDto) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        seat.setCarriageId(seatRequestDto.getCarriageId());
        seat.setName(seatRequestDto.getName());
        seat.setPrice(seatRequestDto.getPrice());
        seat.setDescription(seatRequestDto.getDescription()); 
        seat.setDelete(seatRequestDto.isDelete());    
        seatRepository.save(seat);
    }

    @Override
    public void deleteSeat(int id) {
        Seat seat = seatRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("seat not found with id: " + id));

        seat.setDelete(true); 

        seatRepository.save(seat);
        log.info("seat deleted (set as inactive): {}", seat);
    }

    @Override
    public void restoreSeat(int id) {
        Seat seat = seatRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("seat not found with id: " + id));

        seat.setDelete(false); 

        seatRepository.save(seat);
        log.info("seat restored (set as active): {}", seat);
    }
    
}
