package com.example.train.services.implement;

import com.example.train.dto.request.PromotionRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Promotion;
import com.example.train.exception.NotFoundException;
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

        // Parse sortBy to get field and direction
        String sortField = sortBy.contains(",") ? sortBy.split(",")[0] : sortBy;
        String sortDirection = sortBy.endsWith("desc") ? "desc" : "asc";

        Sort sort = "desc".equalsIgnoreCase(sortDirection)
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        // Create a Pageable object
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        // Fetch paginated and filtered data
        Page<Promotion> promotionPage;
        if (search == null || search.isEmpty()) {
            promotionPage = promotionRepository.findAllByIsDeleteFalse(pageable);
        } else {
            promotionPage = promotionRepository.findByIsDeleteFalseAndNameContainingIgnoreCaseOrIsDeleteFalseAndCodeContainingIgnoreCase(search, search, pageable);
        }

        return PageResponse.<List<Promotion>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(promotionPage.getTotalElements())
                .items(promotionPage.getContent())  // Get content as List<Promotion>
                .build();
    }

    @Override
    public Promotion createPromotion(PromotionRequestDto promotionRequestDto) {
        Promotion promotion = new Promotion();
        promotion.setName(promotionRequestDto.getName());
        promotion.setDescription(promotionRequestDto.getDescription());
        promotion.setStartDate(promotionRequestDto.getStartDate());
        promotion.setEndDate(promotionRequestDto.getEndDate());
        promotion.setPrice(promotionRequestDto.getPrice());
        promotion.setCount(promotionRequestDto.getCount());
        promotion.setCode(promotionRequestDto.getCode());
        return promotionRepository.save(promotion);
    }

    @Override
    public Promotion updatePromotion(int id, PromotionRequestDto promotionRequestDto) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Promotion not found with id: " + id));

        promotion.setName(promotionRequestDto.getName());
        promotion.setDescription(promotionRequestDto.getDescription());
        promotion.setStartDate(promotionRequestDto.getStartDate());
        promotion.setEndDate(promotionRequestDto.getEndDate());
        promotion.setPrice(promotionRequestDto.getPrice());
        promotion.setCount(promotionRequestDto.getCount());
        promotion.setCode(promotionRequestDto.getCode());
        System.out.println("Start Date: " + promotion.getStartDate());
        System.out.println("End Date: " + promotion.getEndDate());

        return promotionRepository.save(promotion);
    }

    @Override
    public void deletePromotion(int id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Promotion not found"));
        promotion.setDelete(true);
        promotionRepository.save(promotion);
    }

    @Override
    public List<Promotion> getAllPromotionsWithIsDeleteFalse() {
        return promotionRepository.findAllByIsDeleteFalse();
    }

    @Override
    public Promotion getPromotionByCode(String code) {
        return promotionRepository.findByCode(code);

    }
}
