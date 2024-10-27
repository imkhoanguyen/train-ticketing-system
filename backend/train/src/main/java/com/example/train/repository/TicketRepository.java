package com.example.train.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.example.train.entity.Ticket;
@Repository
public interface TicketRepository extends JpaRepository<Ticket,Integer>{

}
