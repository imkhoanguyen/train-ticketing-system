package com.example.train.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.train.dto.response.ResponseData;
import com.example.train.dto.response.TicketDetailResponse;
import com.example.train.services.TicketService;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.validation.annotation.Validated;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

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
    @Operation(summary = "Get ticket by ID", description = "Send a request to retrieve a ticket by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<?>> getSchedule(@PathVariable int id) {
        log.info("Request to get station with ID: {}", id);
        TicketDetailResponse ticketDetailResponse = ticketService.getTicket(id);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "ticket retrieved successfully", ticketDetailResponse));
    }

    @Operation(summary = "Delete a ticket", description = "Send a request to delete a ticket by ID")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData<?>> deleteTicket(@PathVariable int id) {
        log.info("Request to delete ticket with ID: {}", id);
        ticketService.deleteTicket(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "ticket deleted successfully", null));
    }
}
