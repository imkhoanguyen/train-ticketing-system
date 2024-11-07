package com.example.train.services;

import com.example.train.dto.response.PageResponse;

public interface PromotionService {
    PageResponse<?> getAllPromotionsAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy);
}
