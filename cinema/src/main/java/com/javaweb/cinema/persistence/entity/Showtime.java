package com.javaweb.cinema.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "showtime")
@Data
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id", nullable = false, updatable = false)
    private Long showtimeId;

    @Column(name = "starttime", nullable = false)
    private LocalTime startTime;

    @Column(name = "endtime", nullable = false)
    private LocalTime endTime;

    @Column(name = "showdate", nullable = false)
    private LocalDate showDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movieid", nullable = false)
    @ToString.Exclude //Loai bo gay stackoverflow
    @JsonIgnore
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roomid", nullable = false)
    @ToString.Exclude //Loai bo gay stackoverflow
    @JsonIgnore
    private Room room;
}
