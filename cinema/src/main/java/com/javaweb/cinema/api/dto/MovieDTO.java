package com.javaweb.cinema.api.dto;

import com.javaweb.cinema.persistence.entity.Movie;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieDTO {
    private Long id;
    private String image;
    private String title;
    private String type;
    private Integer agerating;
    private String country;
    private String director;
    private String performers;
    private Integer duration;
    private String content;
    private String trailer;
    private Long viewer;
    private String moviestatus;

    public MovieDTO(Movie movie) {
        this.id = movie.getMovieId();
        this.image = movie.getImage();
        this.title =  movie.getTitle();
        this.type = movie.getType();
        this.agerating = movie.getAgerating();
        this.country = movie.getCountry();
        this.director = movie.getDirector();
        this.performers = movie.getPerformers();
        this.duration = movie.getDuration();
        this.content = movie.getContent();
        this.trailer = movie.getTrailer();
        this.viewer = movie.getViewer();
        this.moviestatus = movie.getMoviestatus();
    }

}
