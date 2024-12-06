package com.example.train.services;

import java.util.List;

import com.example.train.dto.request.TicketRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.TicketDetailResponse;
import com.example.train.entity.Ticket;
import com.example.train.entity.TicketStatus;

public interface TicketService {
    List<Ticket> addTickets(List<TicketRequestDto> ticketRequestDtos);
    void updateTicket(int id, TicketRequestDto TicketRequestDto);
    void deleteTicket(int id);
    void restoreTicket(int id);

    void updateTicketStatus(int id, TicketStatus status);

    PageResponse<?> getAllTicketAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy,int id);

   // List<TicketDetailResponse> getTicketsByUserId(int userId, TicketStatus status);
}
