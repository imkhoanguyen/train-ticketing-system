package com.example.train.controller;
// import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;
import com.example.train.dto.request.RouteRequestDto;
import com.example.train.dto.response.ResponseData;
import com.example.train.dto.response.RouteDetailResponse;
import com.example.train.services.RouteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/route")
@Validated
@Slf4j
@Tag(name = "Route Controller")                           
@RequiredArgsConstructor

public class RouteController {
    private final RouteService routeService;

    @Operation(summary = "Get list of Routes per pageNo", description = "Send a request via this API to get route list by pageNo and pageSize")
    @GetMapping("/list")
    public ResponseData<?> getAllRoutes() {
        log.info("Request get all stations");
        return new ResponseData<>(HttpStatus.OK.value(), "routes", routeService.getAllRoute());
        
    }

    @Operation(summary = "Get route by ID", description = "Send a request to retrieve a route by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<?>> getRoute(@PathVariable int id) {
        log.info("Request to get station with ID: {}", id);
        RouteDetailResponse routeDetailResponse = routeService.getRoute(id);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Route retrieved successfully", routeDetailResponse));
    }

    @Operation(summary = "Add new route", description = "Send a request to add a new Route")
    @PostMapping("/add")
    public ResponseEntity<ResponseData<?>> addRoute(@Validated @RequestBody RouteRequestDto routeRequestDto) {
        log.info("Request to add a new route: {}", routeRequestDto.getName());
        routeService.addRoute(routeRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseData<>(HttpStatus.CREATED.value(), "Route added successfully", null));
    }

    @Operation(summary = "Update existing route", description = "Send a request to update an existing route")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseData<?>> updateRoute(@PathVariable int id, 
                                                        @Validated @RequestBody RouteRequestDto routeRequestDto) {
        log.info("Request to update route with ID: {}", id);
        routeService.updateRoute(id, routeRequestDto);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Route updated successfully", null));
    }

    @Operation(summary = "Delete a route", description = "Send a request to delete a route by ID")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData<?>> deleteRoute(@PathVariable int id) {
        log.info("Request to delete route with ID: {}", id);
        routeService.deleteRoute(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Route deleted successfully", null));
    }
    
    @Operation(summary = "Restore a deleted route", description = "Send a request to restore a deleted route by ID")
    @PutMapping("/restore/{id}")
    public ResponseEntity<ResponseData<?>> restoreRoute(@PathVariable int id) {
        log.info("Request to restore route with ID: {}", id);
        routeService.restoreRoute(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "route restored successfully", null));
    }

    
}
