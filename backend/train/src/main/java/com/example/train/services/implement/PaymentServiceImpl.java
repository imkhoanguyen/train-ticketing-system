package com.example.train.services.implement;

import com.example.train.config.VNPayConfig;
import com.example.train.dto.request.PaymentRequestDto;
import com.example.train.dto.response.PaymentResponse;
import com.example.train.services.PaymentService;
import com.example.train.utilities.VNPayUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class PaymentServiceImpl implements PaymentService {

    private VNPayConfig payConfig;
    @Override
    public PaymentResponse createPaymentUrl(PaymentRequestDto requestDto) {
        Map<String, String> vnpParams = payConfig.getVnPayConfig();
        vnpParams.put("vnp_Amount", String.valueOf(requestDto.getAmount().multiply(BigDecimal.valueOf(100)).longValue()));
        vnpParams.put("vnp_BankCode", requestDto.getBankCode());
        vnpParams.put("vnp_TxnRef", requestDto.getOrderId());
        vnpParams.put("vnp_OrderInfo", requestDto.getOrderInfo());

        String queryUrl = VNPayUtil.getPaymentURL(vnpParams, true);
        String secureHash = VNPayUtil.hmacSHA512(payConfig.getSecretKey(), queryUrl);

        String paymentUrl = payConfig.getVnp_PayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + secureHash;
        return new PaymentResponse("00", "Success", paymentUrl);
    }

    @Override
    public PaymentResponse handleIPNCallback(Map<String, String> vnpParams) {
        String vnpSecureHash = vnpParams.get("vnp_SecureHash");
        String queryUrl = VNPayUtil.getPaymentURL(vnpParams, true);
        String calculateHash = VNPayUtil.hmacSHA512(payConfig.getSecretKey(), queryUrl);

        if(!calculateHash.equals(vnpSecureHash)) {
            return new PaymentResponse("99", "Invalid signature", null);
        }

        String responseCode = vnpParams.get("vnp_ResponseCode");
        if("00".equals(responseCode)) {
            return new PaymentResponse("00", "Payment Success", null);
        }
        else {
            return new PaymentResponse(responseCode, "Payment Failed", null);
        }

    }


}
