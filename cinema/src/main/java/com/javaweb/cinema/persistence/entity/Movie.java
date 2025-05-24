package com.javaweb.cinema.persistence.entity;
import jakarta.persistence.*;
import lombok.Data;

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

    @Column(name= "title", nullable= false)
    private String title;

    @Column(name= "type")
    private String type;

    @Column(name= "agerating", nullable= false)
    private Integer agerating;

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

    @Column(name= "moviestatus")
    private String moviestatus;

}
