package com.example.train.services.implement;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.train.entity.Discount;
import com.example.train.entity.Schedule;
import com.example.train.entity.Seat;
import com.example.train.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.example.train.dto.request.TicketRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Ticket;
import com.example.train.entity.TicketStatus;
import com.example.train.exception.NotFoundException;
import com.example.train.services.TicketService;

import jakarta.transaction.Transactional;
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
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;
    private final DiscountRepository discountRepository;

    @Override
    public List<Ticket> addTickets(List<TicketRequestDto> ticketRequestDtos) {

        return ticketRequestDtos.stream().map((TicketRequestDto ticketRequestDto) -> {
            Schedule schedule = scheduleRepository.findById(ticketRequestDto.getSchedules_id()).orElse(null);
            if (schedule == null) throw new NotFoundException("Schedule không tìm thấy");

            Schedule returnSchedule = scheduleRepository.findById(ticketRequestDto.getReturnSchedules_id()).orElse(null);
            
            Seat seat = seatRepository.findById(ticketRequestDto.getSeat_id()).orElse(null);
            if (seat == null) throw new NotFoundException("Seat không tìm thấy");

            Seat returnSeat = seatRepository.findById(ticketRequestDto.getReturnSeat_id()).orElse(null);
            String returnSeatName = null; 

            if (returnSeat != null) {
                returnSeatName = returnSeat.getName();
            }
            Discount discount = discountRepository.findByObject(ticketRequestDto.getObject()).orElse(null);
            BigDecimal priceDiscount = discount != null ? discount.getPrice() : BigDecimal.ZERO;

            BigDecimal price = schedule.getPrice().add(seat.getPrice()).subtract(priceDiscount);

            Ticket ticket = Ticket.builder()
                    .schedule(schedule)
                    .returnSchedule(returnSchedule)
                    .seat(seat)
                    .seatName(seat.getName())
                    .returnSeat(returnSeat)
                    .returnSeatName(returnSeatName)
                    .dateBuy(LocalDateTime.now())
                    .status(ticketRequestDto.getStatus())
                    .objectDiscount(ticketRequestDto.getObject())
                    .fullName(ticketRequestDto.getFullname())
                    .cmnd(ticketRequestDto.getCan_cuoc())
                    .price(price)
                    .priceDiscount(priceDiscount)
                    .discount(discount)
                    .build();

                    System.out.println(ticket);
            return ticketRepository.save(ticket);
        }).collect(Collectors.toList());
    }

    @Override
    public void updateTicket(int id, TicketRequestDto TicketRequestDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateTicket'");
    }

    
    @Override 
    public void updateTicketStatus(int id, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ticket not found with id: " + id));

        ticket.setStatus(status);

        ticketRepository.save(ticket);
        log.info("ticket updated: {}", ticket);
    }

    @Override
    public List<Integer> getPaidSeatIds() {
        return ticketRepository.findSeatIdByStatus(TicketStatus.PAID);
    }    
   

    @Override
    public void deleteTicket(int id) {
        Ticket ticket = ticketRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("ticket not found with id: " + id));

        ticketRepository.delete(ticket);
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
