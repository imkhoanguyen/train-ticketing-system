package com.example.train.services;

import com.example.train.dto.request.PaymentRequestDto;
import com.example.train.dto.response.PaymentResponse;

import java.util.Map;

public interface PaymentService {
    PaymentResponse createPaymentUrl(PaymentRequestDto requestDto);
    PaymentResponse handleIPNCallback(Map<String, String> vnpParams);
}
