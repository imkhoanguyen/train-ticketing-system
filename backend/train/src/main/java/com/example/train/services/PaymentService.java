package com.example.train.services;

import com.example.train.dto.request.PaymentRequestDto;
import com.example.train.dto.response.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface PaymentService {
    PaymentResponse createPaymentUrl(HttpServletRequest request);
}
