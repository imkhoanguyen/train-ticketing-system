package com.example.train.dto.request;

import java.math.BigDecimal;

public class SeatSelection {
    private int userId;
    private int scheduleId;
    private int seatId;
    private long time;
    private BigDecimal seatPrice; // Giá vé
    private BigDecimal schedulePrice; // Giá chuyến đi
  
    // Constructors, getters, setters
    public SeatSelection() {}
  
    public SeatSelection(int userId, int scheduleId, int seatId, long time, BigDecimal seatPrice, BigDecimal schedulePrice) {
      this.userId = userId;
      this.scheduleId = scheduleId;
      this.seatId = seatId;
      this.time = time;
      this.seatPrice = seatPrice;
      this.schedulePrice = schedulePrice;
    }
  
    // Getters and Setters
    public int getuserId() { return userId; }
    public void setuserId(int userId) { this.userId = userId; }
  
    public int getScheduleId() { return scheduleId; }
    public void setScheduleId(int scheduleId) { this.scheduleId = scheduleId; }
  
    public int getSeatId() { return seatId; }
    public void setSeatId(int seatId) { this.seatId = seatId; }
  
    public long getTime() { return time; }
    public void setTime(long time) { this.time = time; }
  
    public BigDecimal getSeatPrice() { return seatPrice; }
    public void setSeatPrice(BigDecimal seatPrice) { this.seatPrice = seatPrice; }
  
    public BigDecimal getSchedulePrice() { return schedulePrice; }
    public void setSchedulePrice(BigDecimal schedulePrice) { this.schedulePrice = schedulePrice; }
  }
  