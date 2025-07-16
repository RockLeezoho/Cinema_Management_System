package com.javaweb.cinema.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.javaweb.cinema.persistence.entity.Movie;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieDTO {
    private Long movieId;
    private String image;
    private String title;
    private String format;
    private String type;
    private Integer ageRating;
    private String country;
    private String director;
    private String performers;
    private Integer duration;
    private String content;
    private String trailer;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate premiere;
    private Long viewer;
    private String movieStatus;

    public MovieDTO(Movie movie) {
        this.movieId = movie.getMovieId();
        this.image = movie.getImage();
        this.title =  movie.getTitle();
        this.format = movie.getFormat();
        this.type = movie.getType();
        this.ageRating = movie.getAgeRating();
        this.country = movie.getCountry();
        this.director = movie.getDirector();
        this.performers = movie.getPerformers();
        this.duration = movie.getDuration();
        this.content = movie.getContent();
        this.trailer = movie.getTrailer();
        this.viewer = movie.getViewer();
        this.premiere = movie.getPremiere();
        this.movieStatus = movie.getMovieStatus();
    }

}
