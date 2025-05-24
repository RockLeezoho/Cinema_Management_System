package com.javaweb.cinema.api.dto;

import lombok.Data;

@Data
public class RoomDTO {
    private Long cinemaId;
    private String image;
    private String name;
    private Integer numberOfSeats;
}
