package com.example.train.services;

import com.example.train.dto.request.TicketRequestDto;
import com.example.train.dto.response.PageResponse;

public interface TicketService {
    void updateTicket(int id, TicketRequestDto TicketRequestDto);
    void deleteTicket(int id);
    void restoreTicket(int id);

    PageResponse<?> getAllTicketAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy,int id);
}
