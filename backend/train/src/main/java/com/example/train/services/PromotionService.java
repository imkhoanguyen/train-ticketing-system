package com.example.train.services;

import com.example.train.dto.request.PromotionRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Promotion;

import java.util.List;

public interface PromotionService {
    PageResponse<?> getAllPromotionsAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy);
    Promotion createPromotion(PromotionRequestDto promotionRequestDto);

    Promotion updatePromotion(int id, PromotionRequestDto promotionRequestDto);

    void deletePromotion(int id);
    List<Promotion> getAllPromotionsWithIsDeleteFalse();
}
