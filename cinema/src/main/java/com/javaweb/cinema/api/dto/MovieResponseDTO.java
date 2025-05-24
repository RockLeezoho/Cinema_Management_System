package com.javaweb.cinema.api.dto;

import com.javaweb.cinema.persistence.repository.MovieRepository;
import lombok.Data;

@Data
public class MovieResponseDTO {

    private String image;
    private String title;
    private String type;
    private String country;
    private Integer agerating;
    private Integer duration;
    private String director;
    private String performers;
    private String content;
    private String trailer;

    public MovieResponseDTO(MovieDTO movieDTO) {
        this.image = movieDTO.getImage();
        this.title = movieDTO.getTitle();
        this.type = movieDTO.getType();
        this.country = movieDTO.getCountry();
        this.agerating = movieDTO.getAgerating();
        this.duration = movieDTO.getDuration();
        this.director = movieDTO.getDirector();
        this.performers = movieDTO.getPerformers();
        this.content = movieDTO.getContent();
        this.trailer = movieDTO.getTrailer();
    }
}
