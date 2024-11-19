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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.train.dto.request.StationRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.dto.response.StationDetailResponse;
import com.example.train.entity.Station;
import com.example.train.services.StationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/station")
@Validated
@Slf4j
@Tag(name = "Station Controller")                           
@RequiredArgsConstructor
public class StationController {
    private final StationService stationService;

    @Operation(summary = "Get list of stations per pageNo", description = "Send a request via this API to get station list by pageNo and pageSize")
    @GetMapping("/list/nopage")
    public ResponseData<?> getAllStations() {
        log.info("Request get all stations");
        return new ResponseData<>(HttpStatus.OK.value(), "stations", stationService.getAllStation());
        
    }


    @GetMapping("/list")
    public ResponseData<PageResponse<List<Station>>> GetAllWithLimit(
            @RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "1") int pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", defaultValue = "id,desc") String sortBy) {
            
        PageResponse<List<Station>> response = (PageResponse<List<Station>>) stationService.getAllStationAndSearchWithPagingAndSorting(pageNumber, pageSize, search, sortBy);

        return new ResponseData<>(HttpStatus.OK.value(), "get list discount with limit", response);
    }

    @Operation(summary = "Get station by ID", description = "Send a request to retrieve a station by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<?>> getStation(@PathVariable int id) {
        log.info("Request to get station with ID: {}", id);
        StationDetailResponse stationDetail = stationService.getStation(id);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Station retrieved successfully", stationDetail));
    }

    @Operation(summary = "Add new station", description = "Send a request to add a new station")
    @PostMapping("/add")
    public ResponseEntity<ResponseData<?>> addStation(@Validated @RequestBody StationRequestDto stationRequestDto) {
        log.info("Request to add a new station: {}", stationRequestDto.getName());
        stationService.addStation(stationRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseData<>(HttpStatus.CREATED.value(), "Station added successfully", null));
    }

    @Operation(summary = "Update existing station", description = "Send a request to update an existing station")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseData<?>> updateStation(@PathVariable int id, 
                                                        @Validated @RequestBody StationRequestDto stationRequestDto) {
        log.info("Request to update station with ID: {}", id);
        stationService.updateStation(id, stationRequestDto);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Station updated successfully", null));
    }

    @Operation(summary = "Delete a station", description = "Send a request to delete a station by ID")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData<?>> deleteStation(@PathVariable int id) {
        log.info("Request to delete station with ID: {}", id);
        stationService.deleteStation(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Station deleted successfully", null));
    }
    
    @Operation(summary = "Restore a deleted station", description = "Send a request to restore a deleted station by ID")
    @PutMapping("/restore/{id}")
    public ResponseEntity<ResponseData<?>> restoreStation(@PathVariable int id) {
        log.info("Request to restore station with ID: {}", id);
        stationService.restoreStation(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Station restored successfully", null));
    }

    @Operation(summary = "Add multiple stations", description = "Send a request to add multiple stations")
    @PostMapping("/add-multiple")
    public ResponseEntity<ResponseData<?>> addStations(
            @RequestBody @Validated List<StationRequestDto> stationRequestDtos) {
        log.info("Request to add multiple stations: {}", stationRequestDtos);
        stationService.addMultiStations(stationRequestDtos);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseData<>(HttpStatus.CREATED.value(), "Stations added successfully", null));
    }

}
