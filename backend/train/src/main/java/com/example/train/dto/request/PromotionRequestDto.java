package com.example.train.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Data
public class PromotionRequestDto {
    @NotBlank(message = "Name cannot be empty")
    private String name;
    @NotBlank(message = "Discount cannot be null")
    private String description;

    @NotNull(message = "Start date cannot be null")
    private ZonedDateTime startDate;
    @NotNull(message = "End date cannot be null")
    private ZonedDateTime endDate;

    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Count cannot be null")
    @Positive(message = "Count must be greater than zero")
    private Integer count;
    @NotBlank(message = "Code cannot be empty")
    private String code;

    // Kiểm tra startDate không trước thời điểm hiện tại
    @AssertTrue(message = "Start date must be in the future, including hours, minutes, and seconds")
    public boolean isStartDateValid() {
        return startDate == null || startDate.isAfter(ZonedDateTime.now(ZoneId.systemDefault()));
    }

    // Kiểm tra endDate phải sau startDate tính cả giờ phút giây
    @AssertTrue(message = "End date must be after start date, including hours, minutes, and seconds")
    public boolean isEndDateAfterStartDate() {
        return endDate == null || (startDate != null && endDate.isAfter(startDate));
    }
}
