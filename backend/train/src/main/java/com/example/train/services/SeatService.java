package com.example.train.services;

import java.util.List;

import com.example.train.dto.request.SeatRequestDto;
import com.example.train.dto.response.SeatDetailResponse;

public interface SeatService {
    List<SeatDetailResponse> getAllSeatsByCarriageId(int id);

    SeatDetailResponse getSeat(int id);
    void addSeat(SeatRequestDto seatRequestDto);
    void updateSeat(int id, SeatRequestDto seatRequestDto);
    void deleteSeat(int id);
    void restoreSeat(int id);
}
