package com.example.train.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;


import com.example.train.dto.request.SeatRequestDto;

import com.example.train.dto.response.ResponseData;
import com.example.train.dto.response.SeatDetailResponse;
import com.example.train.services.SeatService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("api/seat")
@Validated
@Slf4j
@Tag(name = "Seat Controller")                           
@RequiredArgsConstructor
public class SeatController {
    private final SeatService seatService;
    @Operation(summary = "Get list of seats", description = "Send a request via this API to get seat list by pageNo and pageSize")
    @GetMapping("/list/{id}")
    public ResponseData<?> getAllSeatsByCarriageId(@PathVariable int id) {
        log.info("Request get all seats");
        return new ResponseData<>(HttpStatus.OK.value(), "seats", seatService.getAllSeatsByCarriageId(id));
        
    }

    @Operation(summary = "Delete a Seat", description = "Send a request to delete a Seat by ID")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData<?>> deleteSeat(@PathVariable int id) {
        log.info("Request to delete Seat with ID: {}", id);
        seatService.deleteSeat(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "seat deleted successfully", null));
    }

    @Operation(summary = "Restore a deleted Seat", description = "Send a request to restore a deleted Seat by ID")
    @PutMapping("/restore/{id}")
    public ResponseEntity<ResponseData<?>> restoreSeat(@PathVariable int id) {
        log.info("Request to restore Seat with ID: {}", id);
        seatService.restoreSeat(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Seat restored successfully", null));
    }

    @Operation(summary = "Add new Seat", description = "Send a request to add a new Seat")
    @PostMapping("/add")
    public ResponseEntity<ResponseData<?>> addSeat(@Validated @RequestBody SeatRequestDto seatRequestDto) {
        log.info("Request to add a new seat: {}", seatRequestDto.getName());
        seatService.addSeat(seatRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseData<>(HttpStatus.CREATED.value(), "Seat added successfully", null));
    }

    @Operation(summary = "Update existing seat", description = "Send a request to update an existing seat")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseData<?>> updateSeat(@PathVariable int id, 
                                                        @Validated @RequestBody SeatRequestDto seatRequestDto) {
        log.info("Request to update seat with ID: {}", id);
        seatService.updateSeat(id, seatRequestDto);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "seat updated successfully", null));
    }

    @Operation(summary = "Get Seat by ID", description = "Send a request to retrieve a Seat by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<?>> getSeat(@PathVariable int id) {
        log.info("Request to get Seat with ID: {}", id);
        SeatDetailResponse seatDetailResponses = seatService.getSeat(id);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Seat retrieved successfully", seatDetailResponses));
    }
}
