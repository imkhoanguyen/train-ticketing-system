package com.example.train.entity;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private BigDecimal price;
    
    private String name;

    private String  description;
    private String code;

    @Builder.Default
    @JsonProperty("isDelete")
    private boolean isDelete = false;

    private int count;

    private ZonedDateTime startDate;

    private ZonedDateTime endDate;
}
