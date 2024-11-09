package com.example.train.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
public class DiscountRequestDto {
    @NotBlank(message = "Object cannot be empty")
    private String object;
    @NotBlank(message = "Description cannot be null")
    private String description;

    @NotNull(message = "Price cannot be null")
    private BigDecimal price;
}
