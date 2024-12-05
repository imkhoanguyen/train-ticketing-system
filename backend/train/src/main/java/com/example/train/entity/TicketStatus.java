package com.example.train.entity;

public enum TicketStatus {
    PENDING,      // Chưa thanh toán
    PAID,         // Đã thanh toán
    CONFIRMED,    // Đã xác nhận
    CANCELLED,    // Đã hủy
    USED,         // Đã sử dụng
    EXPIRED       // Hết hạn
}
