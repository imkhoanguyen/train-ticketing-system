package com.example.train.dto.request;

import lombok.Data;

import java.math.BigDecimal;
@Data
public class PaymentRequestDto {
    private String orderId;
    private String orderInfo;
    private BigDecimal amount;
    private String bankCode;
}
