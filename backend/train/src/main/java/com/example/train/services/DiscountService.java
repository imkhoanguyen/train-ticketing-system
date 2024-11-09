package com.example.train.services;

import com.example.train.dto.request.DiscountRequestDto;
import com.example.train.dto.request.PromotionRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Discount;
import com.example.train.entity.Promotion;

import java.util.List;

public interface DiscountService {
    PageResponse<?> getAllDiscountAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy);
    Discount createDiscount(DiscountRequestDto dto);

    Discount updateDiscount(int id, DiscountRequestDto dto);

    void deleteDiscount(int id);
    List<Discount> getAllDiscountsWithIsDeleteFalse();
}
