package com.example.train.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PromotionRequestDto {
    @NotBlank(message = "Name cannot be empty")
    private String name;
    @NotNull(message = "Discount cannot be null")
    private String description;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal price;
    @NotNull(message = "Count cannot be null")
    private int count;

    // Kiểm tra startDate không trước thời điểm hiện tại
    @AssertTrue(message = "Start date must be today or later")
    public boolean isStartDateValid() {
        return startDate == null || !startDate.isBefore(LocalDateTime.now());
    }

    // Kiểm tra endDate phải sau startDate
    @AssertTrue(message = "End date must be after start date")
    public boolean isEndDateAfterStartDate() {
        return endDate == null || (startDate != null && endDate.isAfter(startDate));
    }
}
