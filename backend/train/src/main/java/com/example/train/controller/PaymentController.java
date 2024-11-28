package com.example.train.controller;

import com.example.train.dto.request.PaymentRequestDto;
import com.example.train.dto.response.PaymentResponse;
import com.example.train.services.PaymentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
@Validated
@Slf4j
@Tag(name = "Payment Controller")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    // Endpoint để tạo URL thanh toán VNPay
    @PostMapping("/create")
    public PaymentResponse createPayment(@RequestBody @Valid PaymentRequestDto paymentRequestDto) {
        return paymentService.createPaymentUrl(paymentRequestDto);
    }

    // Endpoint để nhận và xử lý callback từ VNPay
    @PostMapping("/callback")
    public PaymentResponse handleIPNCallback(HttpServletRequest request) {
        Map<String, String[]> parameterMap = request.getParameterMap();
        Map<String, String> vnpParams = parameterMap.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue()[0]));
        return paymentService.handleIPNCallback(vnpParams);
    }

}
