package com.example.train.services.implement;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.example.train.dto.request.TicketRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Ticket;
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
    public PageResponse<?> getAllTicketAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search,
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

        Page<Ticket> ticketPage;
        if (search == null || search.isEmpty()) {
            ticketPage = ticketRepository.findTicketsByOrderId(id, pageable);
        } else {
            ticketPage = ticketRepository.findTicketsByFullNameAndOrderId(search, id, pageable);
        }

        return PageResponse.<List<Ticket>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(ticketPage.getTotalElements())
                .items(ticketPage.getContent())
                .build();
    }
    
}
