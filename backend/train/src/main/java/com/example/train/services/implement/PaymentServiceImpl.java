package com.example.train.services.implement;

import com.example.train.config.VNPayConfig;
import com.example.train.dto.response.PaymentResponse;
import com.example.train.services.PaymentService;
import com.example.train.utilities.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@RequiredArgsConstructor
@Service
public class PaymentServiceImpl implements PaymentService {

    private final VNPayConfig payConfig;
    @Override
    public PaymentResponse createPaymentUrl(HttpServletRequest request) {
        long amount = Integer.parseInt(request.getParameter("amount")) * 100L;
        String bankCode = request.getParameter("bankCode");
        Map<String, String> vnpParamsMap = payConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        //build query url
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(payConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = payConfig.getVnp_PayUrl() + "?" + queryUrl;
        return PaymentResponse.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl).build();

    }


}
