package com.example.train.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "route")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "startStationId")  
    private int startStationId;
    @Column(name = "endStationId")    
    private int endStationId;

    @Column(name = "is_delete")       
    private boolean isDelete;

    @Transient
    private String startStationName;

    @Transient
    private String endStationName;
}



