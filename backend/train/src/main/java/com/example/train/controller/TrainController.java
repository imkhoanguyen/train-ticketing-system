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

import com.example.train.dto.request.TrainRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.dto.response.TrainDetailResponse;
import com.example.train.entity.Station;
import com.example.train.services.TrainService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("api/train")
@Validated
@Slf4j
@Tag(name = "Train Controller")                           
@RequiredArgsConstructor

public class TrainController {
    private final TrainService trainService;

    @Operation(summary = "Get list of trains per pageNo", description = "Send a request via this API to get route list by pageNo and pageSize")
    @GetMapping("/list/nopage")
    public ResponseData<?> getAllTrains() {
        log.info("Request get all trains");
        return new ResponseData<>(HttpStatus.OK.value(), "routes", trainService.getAllTrains());
        
    }

    @GetMapping("/list")
    public ResponseData<PageResponse<List<Station>>> GetAllWithLimit(
            @RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "1") int pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", defaultValue = "id,desc") String sortBy) {
            
        PageResponse<List<Station>> response = (PageResponse<List<Station>>) trainService.getAllTrainAndSearchWithPagingAndSorting(pageNumber, pageSize, search, sortBy);

        return new ResponseData<>(HttpStatus.OK.value(), "get list discount with limit", response);
    }

    @Operation(summary = "Get train by ID", description = "Send a request to retrieve a train by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<?>> getTrain(@PathVariable int id) {
        log.info("Request to get train with ID: {}", id);
        TrainDetailResponse trainDetailResponse = trainService.getTrain(id);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Train retrieved successfully", trainDetailResponse));
    }

    @Operation(summary = "Add new train", description = "Send a request to add a new train")
    @PostMapping("/add")
    public ResponseEntity<ResponseData<?>> addTrain(@Validated @RequestBody TrainRequestDto trainRequestDto) {
        log.info("Request to add a new train: {}", trainRequestDto.getName());
        trainService.addTrain(trainRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseData<>(HttpStatus.CREATED.value(), "Train added successfully", null));
    }


    @Operation(summary = "Update existing train", description = "Send a request to update an existing train")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseData<?>> updateTrain(@PathVariable int id, 
                                                        @Validated @RequestBody TrainRequestDto trainRequestDto) {
        log.info("Request to update train with ID: {}", id);
        trainService.updateTrain(id, trainRequestDto);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Train updated successfully", null));
    }

    @Operation(summary = "Delete a train", description = "Send a request to delete a train by ID")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData<?>> deleteTrain(@PathVariable int id) {
        log.info("Request to delete station with ID: {}", id);
        trainService.deleteTrain(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Train deleted successfully", null));
    }
    
    @Operation(summary = "Restore a deleted train", description = "Send a request to restore a deleted train by ID")
    @PutMapping("/restore/{id}")
    public ResponseEntity<ResponseData<?>> restoreTrain(@PathVariable int id) {
        log.info("Request to restore train with ID: {}", id);
        trainService.restoreTrain(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Train restored successfully", null));
    }

    @Operation(summary = "Add multiple trains", description = "Send a request to add multiple trains")
    @PostMapping("/add-multiple")
    public ResponseEntity<ResponseData<?>> addTrains(
            @RequestBody @Validated List<TrainRequestDto> trainRequestDtos) {
        log.info("Request to add multiple trains: {}", trainRequestDtos);
        trainService.addMultiTrains(trainRequestDtos);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseData<>(HttpStatus.CREATED.value(), "trains added successfully", null));
    }
}
