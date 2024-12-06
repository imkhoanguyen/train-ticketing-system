package com.example.train.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.train.entity.Seat;

@Repository
public interface SeatRepository extends JpaRepository<Seat,Integer>{
    List<Seat> findByCarriage_Id(int carriageId);
    Page<Seat> findAllByCarriage_Id(int carriageId, Pageable pageable);
    Page<Seat> findByNameContainingIgnoreCaseAndCarriage_Id(String seatName,Pageable pageable,int id);

    @Query("SELECT s FROM Seat s WHERE s.carriage.train.id = :trainId AND s.isDelete = false")
    List<Seat> findAllSeatsByTrainId(int trainId);
} 
