package com.javaweb.cinema.api.dto;

import lombok.Data;

@Data
public class SeatBookingStatusDTO {

    private Long seatId;
    private String name;
    private String seatType;
    private Boolean booked;
}
