package com.javaweb.cinema.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Entity
@Data
@Table(name = "cinema")
public class Cinema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id", updatable= false, nullable= false)
    private Long cinemaId;

    @Column(name= "name", nullable= false)
    private String name;

    @Column(name= "address", nullable= false)
    private String address;

    @Column(name= "hotline", nullable= false)
    private String hotline;

    @Column(name= "email", nullable= false)
    private String email;

    @Column(name= "image")
    private String image;

    @OneToMany(mappedBy = "cinema", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude  // tranh stackoverflow
    @JsonIgnore
    private List<Room> rooms;

    @OneToMany(mappedBy = "cinema", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude  // tranh stackoverflow
    @JsonIgnore
    private List<User> users;
}

