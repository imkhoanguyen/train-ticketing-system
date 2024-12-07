package com.example.train.services;

import com.example.train.dto.response.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    PaymentResponse createPaymentUrl(HttpServletRequest request);
}
