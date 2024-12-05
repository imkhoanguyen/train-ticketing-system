package com.example.train.controller;

import java.util.List;

import com.example.train.dto.request.ScheduleRequestDto;
import com.example.train.dto.request.TicketRequestDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.dto.response.TicketDetailResponse;
import com.example.train.entity.OrderItem;
import com.example.train.entity.Ticket;
import com.example.train.entity.TicketStatus;
import com.example.train.services.TicketService;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.validation.annotation.Validated;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("api/ticket")
@Validated
@Slf4j
@Tag(name = "Ticket Controller")                           
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;
    // @Operation(summary = "Get ticket by ID", description = "Send a request to retrieve a ticket by its ID")
    // @GetMapping("/{id}")
    // public ResponseEntity<ResponseData<?>> getSchedule(@PathVariable int id) {
    //     log.info("Request to get station with ID: {}", id);
    //     TicketDetailResponse ticketDetailResponse = ticketService.getTicket(id);
    //     return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "ticket retrieved successfully", ticketDetailResponse));
    // }



    @GetMapping("/list/{id}")
    public ResponseData<PageResponse<List<Ticket>>> GetAllWithLimit(
            @RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "1") int pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", defaultValue = "id,desc") String sortBy,
            @PathVariable int id) {
            
        PageResponse<List<Ticket>> response = (PageResponse<List<Ticket>>) ticketService.getAllTicketAndSearchWithPagingAndSorting(pageNumber, pageSize, search, sortBy,id);

        return new ResponseData<>(HttpStatus.OK.value(), "get list discount with limit", response);
    }

    @PostMapping("/add")
    public ResponseEntity<ResponseData<?>> addTickets(@Validated @RequestBody List<TicketRequestDto> ticketRequestDtos) {
        List<Ticket> tickets =  ticketService.addTickets(ticketRequestDtos);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ResponseData<>(HttpStatus.CREATED.value(), "Ticket added successfully", tickets));
    }

    @Operation(summary = "Delete a ticket", description = "Send a request to delete a ticket by ID")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData<?>> deleteTicket(@PathVariable int id) {
        log.info("Request to delete ticket with ID: {}", id);
        ticketService.deleteTicket(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "ticket deleted successfully", null));
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<ResponseData<?>> updateTicketStatus(@PathVariable int id, @RequestParam TicketStatus status) {
        ticketService.updateTicketStatus(id, status);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Ticket status updated successfully", null));
    }

    
    
}
