package com.javaweb.cinema.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@Table(name = "voucher")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id", updatable= false, nullable= false)
    private Long voucherId;

    @Column(name= "image")
    private String image;

    @Column(name= "title", nullable= false)
    private String title;

    @Column(name= "condition", nullable= false)
    private String condition;

    @Column(name= "starttime", nullable= false)
    private LocalTime startTime;

    @Column(name= "endtime", nullable = false)
    private LocalTime endTime;
}

