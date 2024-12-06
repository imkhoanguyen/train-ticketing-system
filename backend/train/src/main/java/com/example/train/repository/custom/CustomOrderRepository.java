package com.example.train.repository.custom;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface CustomOrderRepository {
    @Query(value = "SELECT o.subTotal - COALESCE(p.price, 0) AS total " +
            "FROM orders o " +
            "LEFT JOIN promotion p ON o.promotionId = p.id " +
            "WHERE DATE(o.created) = CURRENT_DATE",
            nativeQuery = true) // nativeQuery = raw
    BigDecimal getTotalToDay();

    @Query("SELECT COALESCE(SUM(o.subTotal - " +
            "CASE WHEN o.promotion IS NOT NULL THEN o.promotion.price ELSE 0 END), 0) " +
            "FROM Order o " +
            "WHERE YEAR(o.created) = :year AND MONTH(o.created) = :month") // jpql
    BigDecimal findMonthlyTotal(@Param("year") int year, @Param("month") int month);
}
