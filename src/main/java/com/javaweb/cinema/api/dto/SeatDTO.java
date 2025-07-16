package com.javaweb.cinema.api.dto;

import lombok.Data;

@Data
public class SeatDTO {
    private Long seatId;
    private String image;
    private String name;
    private String seatType;
    private Long roomId;
}
