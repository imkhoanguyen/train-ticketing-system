package com.example.train.controller;

import com.example.train.dto.request.PaymentRequestDto;
import com.example.train.dto.response.PaymentResponse;
import com.example.train.dto.response.ResponseData;
import com.example.train.services.PaymentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

    @GetMapping("/vn-pay")
    public ResponseData<PaymentResponse> pay(HttpServletRequest request) {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", paymentService.createPaymentUrl(request));
    }
    @GetMapping("/vn-pay-callback")
    public void payCallbackHandler(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String status = request.getParameter("vnp_ResponseCode");

        if ("00".equals(status)) {
            // Thanh toán thành công
            response.sendRedirect("http://localhost:4200/booking/confirmation?status=success");
        } else {
            // Thanh toán thất bại
            response.sendRedirect("http://localhost:4200/booking/confirmation?status=failed");
        }
    }



}
