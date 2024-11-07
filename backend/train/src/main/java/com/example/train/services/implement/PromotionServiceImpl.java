package com.example.train.services.implement;

import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Promotion;
import com.example.train.repository.CarriageRepository;
import com.example.train.repository.PromotionRepository;
import com.example.train.services.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;

    @Override
    public PageResponse<List<Promotion>> getAllPromotionsAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy) {
        int page = 0;
        if (pageNo > 0) {
            page = pageNo - 1;
        }

        // Set up sorting by the specified field
        Sort sort = sortBy.endsWith("desc") ? Sort.by(sortBy.replace(",desc", "")).descending() : Sort.by(sortBy).ascending();

        // Create a Pageable object
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        // Fetch paginated and filtered data
        Page<Promotion> promotionPage;
        if (search == null || search.isEmpty()) {
            promotionPage = promotionRepository.findAllByIsDeleteFalse(pageable);
        } else {
            promotionPage = promotionRepository.findByNameContainingIgnoreCaseAndIsDeleteFalse(search, pageable);
        }

        // Create and return PageResponse with List<Promotion> as the items
        return PageResponse.<List<Promotion>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(promotionPage.getTotalElements())
                .items(promotionPage.getContent())  // Get content as List<Promotion>
                .build();
    }

}
