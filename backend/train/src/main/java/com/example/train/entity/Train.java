package com.example.train.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "train")
public class Train {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")  
    private String  description;

    @Column(name = "pictureUrl")    
    private String pictureUrl;

    @Column(name = "is_delete")       
    private boolean isDelete;

}
