package com.javaweb.cinema.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "room")
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long roomId;

    @Column(name= "image")
    private String image;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name= "numberofseats", nullable = false)
    private Integer numberOfSeats;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cinemaid", nullable = false)
    @ToString.Exclude //Loai bo gay stackoverflow
    @JsonIgnore
    private Cinema cinema;
}
