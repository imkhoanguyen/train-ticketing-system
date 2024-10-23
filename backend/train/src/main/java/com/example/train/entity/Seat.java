package com.example.train.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
// Tạo ra một Builder Pattern cho lớp, giúp xây dựng đối tượng một cách linh hoạt.
@Builder
// tạo ra constructor ko có tham số
@NoArgsConstructor
// tạo ra constructor với tất cả tham số
@AllArgsConstructor
@Entity
@Table(name = "seat")
@Data
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "carriage_id", nullable = false)
    private int carriageId;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "description")  
    private String  description;

    @Column(name = "is_delete")       
    private boolean isDelete;

    @Transient
    private String nameCarriage;
}
