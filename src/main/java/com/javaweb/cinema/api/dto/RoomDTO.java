package com.javaweb.cinema.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private Long roomId;
    private Long cinemaId;
    private String image;
    private String name;
    private Integer numberOfSeats;
}
