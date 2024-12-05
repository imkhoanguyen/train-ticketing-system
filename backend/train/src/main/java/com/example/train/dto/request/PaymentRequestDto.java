package com.example.train.dto.request;

import lombok.Data;

import java.math.BigDecimal;
@Data
public class PaymentRequestDto {
    public String orderId;
    public String orderInfo;
    public long amount;
    public String bankCode;
}
