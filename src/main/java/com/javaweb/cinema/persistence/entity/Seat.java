package com.javaweb.cinema.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name= "seat")
@Data
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long seatId;

    @Column(name= "image")
    private String image;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name= "seattype", nullable = false)
    private String seatType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roomid", nullable = false)
    @ToString.Exclude //Loai bo gay stackoverflow
    @JsonIgnore
    private Room room;
}
