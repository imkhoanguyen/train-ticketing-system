package com.example.train.services;

import com.example.train.dto.request.TicketRequestDto;
import com.example.train.dto.response.TicketDetailResponse;

public interface TicketService {
    void updateTicket(int id, TicketRequestDto TicketRequestDto);
    void deleteTicket(int id);
    void restoreTicket(int id);

    TicketDetailResponse getTicket(int id);
}
