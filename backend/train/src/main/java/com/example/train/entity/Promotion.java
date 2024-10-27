package com.example.train.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "promotion")
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "price")
    private BigDecimal price;
    
    @Column(name = "name")
    private String name;

    @Column(name = "description")  
    private String  description;

    @Column(name = "is_delete")       
    private boolean isDelete;
}
