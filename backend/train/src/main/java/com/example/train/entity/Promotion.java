package com.example.train.entity;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    @Builder.Default
    @JsonProperty("isDelete")
    private boolean isDelete = false;

    private int count;

    private LocalDateTime startDate;

    private LocalDateTime endDate;
}
