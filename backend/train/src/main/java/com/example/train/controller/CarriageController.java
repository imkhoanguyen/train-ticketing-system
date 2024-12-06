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
import com.example.train.dto.request.CarriageRequestDto;
import com.example.train.dto.response.CarriageDetailResponse;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.entity.Carriage;
import com.example.train.services.CarriageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("api/carriage")
@Validated
@Slf4j
@Tag(name = "Carriage Controller")                           
@RequiredArgsConstructor
public class CarriageController {
    private final CarriageService carriageService;
    @Operation(summary = "Get list of carriages", description = "Send a request via this API to get carriage list by pageNo and pageSize")
    @GetMapping("/list/{id}")
    public ResponseData<PageResponse<List<Carriage>>> GetAllWithLimit(
            @RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "1") int pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", defaultValue = "id,desc") String sortBy,
            @PathVariable int id) {

        PageResponse<List<Carriage>> response = (PageResponse<List<Carriage>>) carriageService.getAllCarriageAndSearchWithPagingAndSorting(pageNumber, pageSize, search, sortBy,id);

        return new ResponseData<>(HttpStatus.OK.value(), "get list discount with limit", response);
    }


     @Operation(summary = "Get Carriage by ID", description = "Send a request to retrieve a Carriage by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<?>> getCarriage(@PathVariable int id) {
        log.info("Request to get carriage with ID: {}", id);
        CarriageDetailResponse carriageDetailResponse = carriageService.getCarriage(id);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Carriage retrieved successfully", carriageDetailResponse));
    }
    @GetMapping("trainId/{id}")
    public ResponseEntity<ResponseData<?>> getAllCarriageByTrainId(@PathVariable int id) {
        log.info("Request to get carriage with ID: {}", id);
        List<CarriageDetailResponse> carriageDetailResponse = carriageService.getAllCarriagesByTrainId(id);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "Carriage retrieved successfully", carriageDetailResponse));
    }

    @Operation(summary = "Add new Carriage", description = "Send a request to add a new Carriage")
    @PostMapping("/add")
    public ResponseEntity<ResponseData<?>> addCarriage(@Validated @RequestBody CarriageRequestDto carriageRequestDto) {
        log.info("Request to add a new Carriage: {}", carriageRequestDto.getTrainId());
        carriageService.addCarriage(carriageRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseData<>(HttpStatus.CREATED.value(), "Carriage added successfully", null));
    }

    @Operation(summary = "Update existing Carriage", description = "Send a request to update an existing carriage")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseData<?>> updateCarriage(@PathVariable int id, 
                                                        @Validated @RequestBody CarriageRequestDto carriageRequestDto) {
        log.info("Request to update carriage with ID: {}", id);
        carriageService.updateCarriage(id, carriageRequestDto);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK.value(), "carriage updated successfully", null));
    }

    @Operation(summary = "Delete a Carriage", description = "Send a request to delete a Carriage by ID")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData<?>> deleteCarriage(@PathVariable int id) {
        log.info("Request to delete Carriage with ID: {}", id);
        carriageService.deleteCarriage(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "carriage deleted successfully", null));
    }

    @Operation(summary = "Restore a deleted Carriage", description = "Send a request to restore a deleted Carriage by ID")
    @PutMapping("/restore/{id}")
    public ResponseEntity<ResponseData<?>> restoreCarriage(@PathVariable int id) {
        log.info("Request to restore Carriage with ID: {}", id);
        carriageService.restoreCarriage(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseData<>(HttpStatus.OK.value(), "Carriage restored successfully", null));
    }

}
