package com.javaweb.cinema.api.dto;

import com.javaweb.cinema.persistence.entity.Seat;
import com.javaweb.cinema.persistence.entity.Showtime;
import com.javaweb.cinema.persistence.entity.TicketType;
import com.javaweb.cinema.persistence.entity.User;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TicketDTO {

    private Long ticketId;
    private LocalDate showDate;
    private LocalDate paymentDate;
    private String paymentMethod;
    private UserDTO user;
    private TicketTypeDTO ticketType; //dung de tranh vong lap vo han tuan hoan giua cac entity
    private SeatDTO seat;
    private ShowtimeDTO showtime;
}
