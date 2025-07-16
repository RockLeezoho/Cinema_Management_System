package com.javaweb.cinema.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CinemaDTO {
    private Long cinemaId;
    private String name;
    private String address;
    private String hotline;
    private String email;
    private String image;

    public CinemaDTO(Long cinemaId, String name, String address, String image) {
        this.cinemaId = cinemaId;
        this.name = name;
        this.address = address;
        this.image = image;
    }
}
