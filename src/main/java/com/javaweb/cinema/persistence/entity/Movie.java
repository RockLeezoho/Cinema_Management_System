package com.javaweb.cinema.persistence.entity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "movie")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id", updatable= false, nullable= false)
    private Long movieId;

    @Column(name= "image")
    private String image;

    @Column(name= "format")
    private String format;

    @Column(name= "title", nullable= false)
    private String title;

    @Column(name= "type")
    private String type;

    @Column(name= "agerating", nullable= false)
    private Integer ageRating;

    @Column(name= "country", nullable= false)
    private String country;

    @Column(name= "director")
    private String director;

    @Column(name= "performers")
    private String performers;

    @Column(name= "duration")
    private Integer duration;

    @Column(name= "content")
    private String content;

    @Column(name= "trailer")
    private String trailer;

    @Column(name= "viewer")
    private Long viewer;

    @Column(name= "premiere")
    private LocalDate premiere;

    @Column(name= "moviestatus")
    private String movieStatus;

}
