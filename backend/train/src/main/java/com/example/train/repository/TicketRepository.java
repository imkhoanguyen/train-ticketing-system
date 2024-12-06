package com.example.train.repository;

import java.util.List;
import java.util.Optional;

import com.example.train.repository.custom.CustomTicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.train.entity.Ticket;
import com.example.train.entity.TicketStatus;
@Repository
public interface TicketRepository extends JpaRepository<Ticket,Integer>, CustomTicketRepository {
    @Query("SELECT o.ticket FROM OrderItem o WHERE o.order.id = :orderId")
    Page<Ticket> findTicketsByOrderId(@Param("orderId") int orderId, Pageable pageable);
    @Query("SELECT o.ticket FROM OrderItem o WHERE o.ticket.fullName LIKE %:fullName% AND o.order.id = :orderId")
    Page<Ticket> findTicketsByFullNameAndOrderId(@Param("fullName") String fullName, @Param("orderId") int orderId, Pageable pageable);

    Optional<Ticket> findById(int id);

    @Query("SELECT t.seat.id FROM Ticket t WHERE t.status = :status")
    List<Integer> findSeatIdByStatus( TicketStatus status);
    
}
