package com.javaweb.cinema.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TicketResponseDTO {

    private Long ticketId;
    private String movieName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate showDate;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime startTime;

    private String seatName;
    private String ticketType;
    private Double ticketPrice;
    private String username;
    private String fullName;
}
