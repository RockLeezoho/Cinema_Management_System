package com.javaweb.cinema.api.dto;

import lombok.Data;

@Data
public class SeatDTO {
    private Long id;
    private String image;
    private String name;
    private String seattype;
    private Long roomId;
}
