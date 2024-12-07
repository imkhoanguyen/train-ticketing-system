package com.example.train.services;

import java.util.List;

import com.example.train.dto.request.SeatRequestDto;
import com.example.train.dto.request.SeatSelection;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.SeatDetailResponse;

import reactor.core.publisher.Flux;

public interface SeatService {
    List<SeatDetailResponse> getAllSeatsByCarriageId(int id);

    SeatDetailResponse getSeat(int id);
    void addSeat(SeatRequestDto seatRequestDto);
    void updateSeat(int id, SeatRequestDto seatRequestDto);
    void deleteSeat(int id);
    void restoreSeat(int id);

    PageResponse<?> getAllSeatAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy,int id);

    List<SeatDetailResponse> getAllSeatsByTrainId(int id);

    void cancelSeatSelection(SeatSelection seatSelection);
    SeatSelection getReservedSeat(int seatId);
    void saveSeatSelection(SeatSelection seatSelection);
   
    //SSE
    Flux<String> streamExpiredSeats();
}
