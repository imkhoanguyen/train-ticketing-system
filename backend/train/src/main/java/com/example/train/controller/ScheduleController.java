package com.example.train.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.example.train.dto.request.ScheduleRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;

import com.example.train.dto.response.ScheduleDetailResponse;
import com.example.train.entity.Schedule;
import com.example.train.services.ScheduleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("api/schedule")
@Validated
@Slf4j
@Tag(name = "Schedule Controller")
@RequiredArgsConstructor

public class ScheduleController {
    private final ScheduleService ScheduleService;
    @GetMapping("/list/{id}")
    public ResponseData<PageResponse<List<Schedule>>> GetAllWithLimit(
            @RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "1") int pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", defaultValue = "id,desc") String sortBy,
            @PathVariable int id) {

        PageResponse<List<Schedule>> response = (PageResponse<List<Schedule>>) ScheduleService.getAllScheduleAndSearchWithPagingAndSorting(pageNumber, pageSize, search, sortBy,id);

        return new ResponseData<>(HttpStatus.OK.value(), "get list discount with limit", response);
    }

    @Operation(summary = "Get route by ID", description = "Send a request to retrieve a route by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<?>> getSchedule(@PathVariable int id) {
        log.info("Request to get station with ID: {}", id);
        ScheduleDetailResponse scheduleDetailResponse = ScheduleService.getSchedule(id);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Route retrieved successfully", scheduleDetailResponse));
    }

    @GetMapping("/routeId/{id}")
    public ResponseEntity<ResponseData<?>> getScheduleByRouteId(@PathVariable int id) {
        log.info("Request to get station with ID: {}", id);
        List<ScheduleDetailResponse> scheduleDetailResponse = ScheduleService.getAllSchedulesByRouteId(id);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Route retrieved successfully", scheduleDetailResponse));
    }
    @Operation(summary = "Add new schedule", description = "Send a request to add a new Route")
    @PostMapping("/add")
    public ResponseEntity<ResponseData<?>> addSchedule(@Validated @RequestBody ScheduleRequestDto scheduleRequestDto) {
        log.info("Request to add a new schedule: {}", scheduleRequestDto.getTrainId());
        ScheduleService.addSchedule(scheduleRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseData<>(HttpStatus.CREATED.value(), "Schedule added successfully", null));
    }

    @Operation(summary = "Update existing schedule", description = "Send a request to update an existing route")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseData<?>> updateSchedule(@PathVariable int id,
                                                          @Validated @RequestBody ScheduleRequestDto scheduleRequestDto) {
        log.info("Request to update route with ID: {}", id);
        ScheduleService.updateSchedule(id, scheduleRequestDto);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Route updated successfully", null));
    }

    @Operation(summary = "Delete a schedule", description = "Send a request to delete a schedule by ID")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData<?>> deleteSchedule(@PathVariable int id) {
        log.info("Request to delete schedule with ID: {}", id);
        ScheduleService.deleteSchedule(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Route deleted successfully", null));
    }

    @Operation(summary = "Restore a deleted Schedule", description = "Send a request to restore a deleted Schedule by ID")
    @PutMapping("/restore/{id}")
    public ResponseEntity<ResponseData<?>> restoreSchedule(@PathVariable int id) {
        log.info("Request to restore Schedule with ID: {}", id);
        ScheduleService.restoreSchedule(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Schedule restored successfully", null));
    }

}
