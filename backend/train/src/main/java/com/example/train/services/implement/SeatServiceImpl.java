package com.example.train.services.implement;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.train.dto.request.SeatRequestDto;
import com.example.train.dto.response.PageResponse;
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
    public PageResponse<?> getAllSeatAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search,
            String sortBy,int id) {
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

        Page<Seat> seatPage;
        if(search == null || search.isEmpty()){
            seatPage = seatRepository.findAllByCarriage_Id(id,pageable);
        } else {
            seatPage = seatRepository.findByNameContainingIgnoreCaseAndCarriage_Id(search, pageable,id);
        }

        return PageResponse.<List<Seat>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(seatPage.getTotalElements())
                .items(seatPage.getContent())
                .build();
    }

    @Override
    public List<SeatDetailResponse> getAllSeatsByCarriageId(int id) {
        List<Seat> seats = seatRepository.findByCarriage_Id(id);

        List<SeatDetailResponse> seatDetailResponses = seats.stream()
                .map(seat -> {
                    return SeatDetailResponse.builder()
                            .id(seat.getId())
                           .carriage(seat.getCarriage())
                           .name(seat.getName())
                           .price(seat.getPrice())
                           .description(seat.getDescription())
                           .isDelete(seat.isDelete())
                            .build();
                })
                .toList();

        return seatDetailResponses;
    }

    @Override
    public SeatDetailResponse getSeat(int id) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        return SeatDetailResponse.builder()
                .id(seat.getId())
               .carriage(seat.getCarriage())
                .name(seat.getName())
                .price(seat.getPrice())
                .description(seat.getDescription())
                .isDelete(seat.isDelete())
                .build();
    }

    @Override
    public void addSeat(SeatRequestDto seatRequestDto) {
        Carriage carriage = carriageRepository.findById(seatRequestDto.getCarriageId())
        .orElseThrow(() -> new IllegalArgumentException("End station not found with id: " + seatRequestDto.getCarriageId()));
        Seat seat = Seat.builder()
           .carriage(carriage)
            .name(seatRequestDto.getName()) 
            .price(seatRequestDto.getPrice())
            .description(seatRequestDto.getDescription())     
            .isDelete(seatRequestDto.isDelete())
            .build();
            seatRepository.save(seat);
    }


    @Override
    public void updateSeat(int id, SeatRequestDto seatRequestDto) {
        Carriage carriage = carriageRepository.findById(seatRequestDto.getCarriageId())
        .orElseThrow(() -> new IllegalArgumentException("End station not found with id: " + seatRequestDto.getCarriageId()));
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
       seat.setCarriage(carriage);
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
