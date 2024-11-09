package com.example.train.controller;

import com.example.train.dto.request.DiscountRequestDto;
import com.example.train.dto.request.PromotionRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.entity.Discount;
import com.example.train.entity.Promotion;
import com.example.train.services.DiscountService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/discount")
@Slf4j
@Validated
@Tag(name = "Discount Controller")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountService discountService;

    @GetMapping("/list")
    public ResponseData<PageResponse<List<Discount>>> GetAllWithLimit(
            @RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "1") int pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sortBy", defaultValue = "id,desc") String sortBy) {

        PageResponse<List<Discount>> response = (PageResponse<List<Discount>>) discountService.getAllDiscountAndSearchWithPagingAndSorting(pageNumber, pageSize, search, sortBy);

        return new ResponseData<>(HttpStatus.OK.value(), "get list discount with limit", response);
    }

    @GetMapping("/list-all")
    public ResponseData<List<Discount>> getAllWithIsDeleteFalse() {
        List<Discount> discounts = discountService.getAllDiscountsWithIsDeleteFalse();
        return new ResponseData<>(HttpStatus.OK.value(), "get all promotions", discounts);
    }

    @PostMapping("/create")
    public ResponseData<?> createPromotion(@Valid @RequestBody DiscountRequestDto dto, BindingResult bindingResult) {
        Discount created = discountService.createDiscount(dto);
        return new ResponseData<>(HttpStatus.OK.value(), "Created successfully", created);
    }


    @PutMapping("/update/{id}")
    public ResponseData<?> updatePromotion(@PathVariable int id, @Valid @RequestBody DiscountRequestDto dto) {
        Discount updated = discountService.updateDiscount(id, dto);
        return new ResponseData<>(HttpStatus.OK.value(), "updated successfully", updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseData<?> deletePromotion(@PathVariable int id) {
        discountService.deleteDiscount(id);
        return new ResponseData<>(HttpStatus.OK.value(), "deleted successfully");
    }
}
