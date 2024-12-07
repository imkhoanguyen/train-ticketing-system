package com.example.train.repository.custom;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface CustomOrderRepository {
    @Query(value = "SELECT SUM(o.subTotal - COALESCE(p.price, 0)) AS total " +
            "FROM orders o " +
            "LEFT JOIN promotion p ON o.promotionId = p.id " +
            "WHERE DATE(o.created) = CURRENT_DATE",
            nativeQuery = true)
    BigDecimal getTotalToDay();


    @Query(value = "SELECT COALESCE(SUM(o.subTotal - COALESCE(p.price, 0)), 0) " +
            "FROM orders o " +
            "LEFT JOIN promotion p ON o.promotionId = p.id " +
            "WHERE YEAR(o.created) = :year " +
            "AND MONTH(o.created) = :month", nativeQuery = true)
    BigDecimal findMonthlyTotal(@Param("year") int year, @Param("month") int month);
}
