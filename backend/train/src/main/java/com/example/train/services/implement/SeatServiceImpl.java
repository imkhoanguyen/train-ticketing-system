package com.example.train.services.implement;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.example.train.dto.request.SeatSelection;
import com.example.train.dto.response.ScheduleDetailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.train.dto.request.SeatRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.SeatDetailResponse;
import com.example.train.entity.Carriage;
import com.example.train.entity.Seat;
import com.example.train.repository.CarriageRepository;
import com.example.train.repository.SeatRepository;
import com.example.train.services.SeatService;

import java.time.Duration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
@Service
// ghi log
@Slf4j
// khởi tạo bean UserRepository
@RequiredArgsConstructor
@EnableScheduling
public class SeatServiceImpl implements SeatService{
    private final CarriageRepository carriageRepository;
    private final SeatRepository seatRepository;

    @Autowired 
    private RedisTemplate<String, Object> redisTemplate; 

    private static final long EXPIRATION_TIME =120;
    
    private String getSeatKey(int userId, int seatId) {
        return String.format("seat:%s:%d", userId, seatId);
    }
    @Override 
    public void saveSeatSelection(SeatSelection seatSelection) { 
        String key = getSeatKey(seatSelection.getuserId(), seatSelection.getSeatId()); 
        seatSelection.setTime(System.currentTimeMillis());
        redisTemplate.opsForValue().set(key, seatSelection, EXPIRATION_TIME, TimeUnit.SECONDS); 
        System.out.println("Saved seat selection with key: " + key); 
    } 
        
    @Override 
    public void cancelSeatSelection(SeatSelection seatSelection) { 
        String key = getSeatKey(seatSelection.getuserId(), seatSelection.getSeatId()); 
        redisTemplate.delete(key); 
        System.out.println("Cancelled seat selection with key: " + key); 
    } 
    @Override 
    public SeatSelection getReservedSeat(int userId, int seatId) { 
        String key = getSeatKey(userId, seatId); 
        SeatSelection seatSelection = (SeatSelection) redisTemplate.opsForValue().get(key); 
        System.out.println("Retrieved seat selection with key: " + key); 
        return seatSelection; 
    } 

    @Override
    public Flux<String> streamExpiredSeats() {
        return Flux.interval(Duration.ofSeconds(1))
            .map(tick -> {
                Set<String> keys = redisTemplate.keys("seat:*");
                Map<String, Long> countdownSeats = new HashMap<>();
                List<String> expiredSeats = new ArrayList<>();
                if (keys != null) {
                    for (String key : keys) {
                        Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
                        if(ttl != null && ttl > 0) {
                            countdownSeats.put(key, ttl);
                        }
                        else if (ttl != null && ttl <= 0) {
                            redisTemplate.delete(key);
                            System.out.println("Deleted expired seat selection with key: " + key);
                            expiredSeats.add(key);
                        }
                    }
                }
                return String.join(",", expiredSeats) + countdownSeats.toString();
            });
    }

    @Override
    public List<SeatDetailResponse> getAllSeatsByTrainId(int id){
        List<Seat> seats = seatRepository.findAllSeatsByTrainId(id);

        return seats.stream()
                .map(seat -> SeatDetailResponse.builder()
                        .id(seat.getId())
                        .name(seat.getName())
                        .price(seat.getPrice())
                        .description(seat.getDescription())
                        .is_delete(seat.isDelete())
                        .build()
                ).toList();
    }

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

        return seats.stream()
                .map(seat -> SeatDetailResponse.builder()
                            .id(seat.getId())
                            .name(seat.getName())
                            .price(seat.getPrice())
                            .description(seat.getDescription())
                            .is_delete(seat.isDelete())
                            .build()
                ).toList();

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
                .is_delete(seat.isDelete())
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
