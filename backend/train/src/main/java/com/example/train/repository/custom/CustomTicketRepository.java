package com.example.train.repository.custom;

import org.springframework.data.jpa.repository.Query;

public interface CustomTicketRepository {
    @Query(value = "SELECT COUNT(t.id) " +
            "FROM ticket t " +  
            "WHERE DATE(t.dateBuy) = CURRENT_DATE",
            nativeQuery = true)
    int getCountTicketToDay();
}
