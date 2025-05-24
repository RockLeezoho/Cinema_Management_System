package com.javaweb.cinema.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id", updatable= false, nullable= false)
    private Long userId;

    @Column(name= "image")
    private String image;

    @Column(name= "name", nullable= false)
    private String name;

    @Column(name= "dateofbirth")
    private LocalDate dateOfBirth;

    @Column(name= "phone", nullable= false)
    private String phone;

    @Column(name= "email", nullable= false)
    private String email;

    @Column(name= "personalid")
    private String personalId;

    @Column(name= "username")
    private String username;

    @Column(name= "password")
    private String password;

    @Column(name= "accountstatus")
    private String accountStatus;

    @Column(name= "position")
    private String position;

    @Column(name= "role", nullable= false)
    private String role;

    //Foreign key to cinema
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "cinemaid")
    @ToString.Exclude  // tranh stackoverflow
    //The cinema field in User is where the foreign key is stored and the relationship is managed
    private Cinema cinema;

}
