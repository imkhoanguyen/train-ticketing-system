package com.example.train.services.implement;

import com.example.train.dto.request.DiscountRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.entity.Discount;
import com.example.train.entity.Promotion;
import com.example.train.exception.NotFoundException;
import com.example.train.repository.DiscountRepository;
import com.example.train.services.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;

    @Override
    public PageResponse<?> getAllDiscountAndSearchWithPagingAndSorting(int pageNo, int pageSize, String search, String sortBy) {
        int page = 0;
        if(pageNo > 0){
            page = pageNo - 1;
        }

        String sortField = sortBy.contains(",") ? sortBy.split(",")[0] : sortBy;
        String sortDirection = sortBy.endsWith("desc") ? "desc" : "asc";

        Sort sort = "desc".equalsIgnoreCase(sortDirection)
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<Discount> discountPage;
        if(search == null || search.isEmpty()){
            discountPage = discountRepository.findAllByIsDeleteFalse(pageable);
        } else {
            discountPage = discountRepository.findByObjectContainingIgnoreCaseAndIsDeleteFalse(search, pageable);
        }

        return PageResponse.<List<Discount>>builder()
                .page(pageNo)
                .size(pageSize)
                .total(discountPage.getTotalElements())
                .items(discountPage.getContent())
                .build();
    }

    @Override
    public Discount createDiscount(DiscountRequestDto dto) {
        Discount discount = new Discount();
        discount.setObject(dto.getObject());
        discount.setPrice(dto.getPrice());
        discount.setDescription(dto.getDescription());

        return discountRepository.save(discount);
    }

    @Override
    public Discount updateDiscount(int id, DiscountRequestDto dto) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Discount not found with id: " + id));

        discount.setObject(dto.getObject());
        discount.setPrice(dto.getPrice());
        discount.setDescription(dto.getDescription());
        return discountRepository.save(discount);
    }

    @Override
    public void deleteDiscount(int id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Discount not found with id: " + id));

        discount.setDelete(true);
        discountRepository.save(discount);
    }

    @Override
    public List<Discount> getAllDiscountsWithIsDeleteFalse() {
        return discountRepository.findAllByIsDeleteFalse();
    }
}
