package com.example.train.services.implement;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.AbstractMap.SimpleEntry;
import java.util.Map.Entry;

import org.springframework.stereotype.Service;

import com.example.train.dto.request.TicketRequestDto;
import com.example.train.dto.response.TicketDetailResponse;
import com.example.train.entity.Promotion;
import com.example.train.entity.Schedule;
import com.example.train.entity.Seat;
import com.example.train.entity.Station;
import com.example.train.entity.Ticket;
import com.example.train.entity.Route;
import com.example.train.repository.PromotionRepository;
import com.example.train.repository.RouteRepository;
import com.example.train.repository.ScheduleRepository;
import com.example.train.repository.SeatRepository;
import com.example.train.repository.StationRepository;
import com.example.train.repository.TicketRepository;
import com.example.train.services.TicketService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// import org.hibernate.mapping.Map;

@Service
// ghi log
@Slf4j
// khởi tạo bean UserRepository
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final SeatRepository seatRepository;
    private final ScheduleRepository scheduleRepository;
    private final PromotionRepository promotionRepository;
    private final RouteRepository routeRepository;
    private final StationRepository stationRepository;
    @Override
    public void updateTicket(int id, TicketRequestDto TicketRequestDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateTicket'");
    }

    @Override
    public void deleteTicket(int id) {
        Ticket ticket = ticketRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("ticket not found with id: " + id));

        ticket.setStatus("Đã sử dụng"); 

        ticketRepository.save(ticket);
        log.info("ticket deleted (set as inactive): {}", ticket);
    }

    @Override
    public void restoreTicket(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'restoreTicket'");
    }

    @Override
    public TicketDetailResponse getTicket(int id) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));

        // Lấy tất cả ghế và lịch trình từ các repository
        List<Seat> seats = seatRepository.findAll();
        List<Schedule> schedules = scheduleRepository.findAll();
        List<Promotion> promotions=promotionRepository.findAll();
        List<Route> routes=routeRepository.findAll();
        
        // Tạo map để ánh xạ id -> tên ghế
        Map<Integer, String> seatMap = seats.stream()
                .collect(Collectors.toMap(Seat::getId, Seat::getName));

        // Tạo map để ánh xạ id -> thông tin lịch trình (startDate, endDate)
        Map<Integer, Entry<LocalDateTime, LocalDateTime>> scheduleMap = schedules.stream()
                .collect(Collectors.toMap(
                        Schedule::getId,
                        schedule -> new SimpleEntry<>(schedule.getStartDate(), schedule.getEndDate())
                ));
        Map<Integer, Integer> scheduleMapgetRoute = schedules.stream()
                .collect(Collectors.toMap(Schedule::getId, Schedule::getRouteId));

        Map<Integer, String> promotionMap = promotions.stream()
                .collect(Collectors.toMap(Promotion::getId, Promotion::getName));

        Map<Integer, Entry<Integer , Integer>> routeMap = routes.stream()
                .collect(Collectors.toMap(
                        Route::getId,
                        route -> new SimpleEntry<>(route.getStartStationId(), route.getEndStationId())
                ));
        // Lấy tên ghế và thông tin lịch trình cho ticket này
        String seatName = seatMap.get(ticket.getSeat_id());

        String promotionName=promotionMap.get(ticket.getPromotion_id());

        Entry<LocalDateTime, LocalDateTime> scheduleInfo = scheduleMap.get(ticket.getSchedules_id());
        LocalDateTime startDate = scheduleInfo.getKey();
        LocalDateTime endDate = scheduleInfo.getValue();

        Entry<Integer, Integer> routeInfo = routeMap.get(scheduleMapgetRoute.get(ticket.getSchedules_id()));
        Integer startStationID = routeInfo.getKey();
        Integer endStationID = routeInfo.getValue();
        
        Station startStation = stationRepository.findById(startStationID)
            .orElseThrow(() -> new RuntimeException("Start station not found with id: " + startStationID));

        Station endStation = stationRepository.findById(endStationID)
            .orElseThrow(() -> new RuntimeException("End station not found with id: " + endStationID));

        return TicketDetailResponse.builder()
                .id(ticket.getId())
                .schedules_id(ticket.getSchedules_id())
                .seat_id(ticket.getSeat_id())
                .dateBuy(ticket.getDateBuy())
                .status(ticket.getStatus())
                .object(ticket.getObject())
                .fullname(ticket.getFullname())
                .can_cuoc(ticket.getCan_cuoc())
                .promotion_id(ticket.getPromotion_id())
                .price(ticket.getPrice())
                .price_reduced(ticket.getPrice_reduced())
                .seatName(seatName)
                .promotionName(promotionName)
                .startDate(startDate)
                .endDate(endDate)
                .startStation(startStation.getName())
                .endStation(endStation.getName())
                .build();
    }

    
    
    
}
