package com.example.train.controller;

import com.example.train.dto.request.PromotionRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.entity.Promotion;
import com.example.train.services.PromotionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/promotion")
@Slf4j
@Validated
@Tag(name = "Promotion Controller")
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService promotionService;

    @GetMapping("/list")
    public ResponseData<PageResponse<List<Promotion>>> GetAllWithLimit(
            @RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "1") int pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", defaultValue = "id,desc") String sortBy) {

        PageResponse<List<Promotion>> response = (PageResponse<List<Promotion>>) promotionService.getAllPromotionsAndSearchWithPagingAndSorting(pageNumber, pageSize, search, sortBy);

        return new ResponseData<>(HttpStatus.OK.value(), "get list promotion", response);
    }

    @GetMapping("/list-all")
    public ResponseData<List<Promotion>> getAllPromotionsWithIsDeleteFalse() {
        List<Promotion> promotions = promotionService.getAllPromotionsWithIsDeleteFalse();
        return new ResponseData<>(HttpStatus.OK.value(), "get all promotions", promotions);
    }

    @PostMapping("/create")
    public ResponseData<?> createPromotion(@Valid @RequestBody PromotionRequestDto promotionRequestDto, BindingResult bindingResult) {
        Promotion createdPromotion = promotionService.createPromotion(promotionRequestDto);
        return new ResponseData<>(HttpStatus.OK.value(), "Created successfully", createdPromotion);
    }


    @PutMapping("/update/{id}")
    public ResponseData<Promotion> updatePromotion(@PathVariable int id, @Valid @RequestBody PromotionRequestDto promotionRequestDto) {
        Promotion updatedPromotion = promotionService.updatePromotion(id, promotionRequestDto);
        return new ResponseData<>(HttpStatus.OK.value(), "updated successfully", updatedPromotion);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseData<String> deletePromotion(@PathVariable int id) {
        promotionService.deletePromotion(id);
        return new ResponseData<>(HttpStatus.OK.value(), "deleted successfully");
    }

    @GetMapping("/code/{code}")
    public ResponseData<Promotion> getPromotionByCode(@PathVariable String code) {
        Promotion promotion =  promotionService.getPromotionByCode(code);
        return new ResponseData<>(HttpStatus.OK.value(), "get successfully", promotion);
    }
    @PutMapping("/updateCount/{id}/{count}")
    public ResponseData<?> updatePromotionCount(@PathVariable int id, @PathVariable int count) {
        promotionService.updatePromotionCount(id, count);
        return new ResponseData<>(HttpStatus.OK.value(), "updated successfully");
    }
}
