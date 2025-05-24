package com.javaweb.cinema.api.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TicketDetailResponseDTO {

    private Long ticketId;
    private LocalDate showDate;
    private LocalDate paymentDate;
    private String paymentMethod;

    private UserViewDTO user;
    private TicketTypeViewDTO ticketType;
    private SeatViewDTO seat;
    private ShowtimeViewDTO showtime;

    @Data
    public static class UserViewDTO {
        private String name;
        private String username;
        private String phone;
        private String email;
    }

    @Data
    public static class TicketTypeViewDTO {
        private String name;
        private Double price;
        private VoucherViewDTO voucher;
    }

    @Data
    public static class VoucherViewDTO {
        private String title;
        private String condition;
        private LocalTime startTime;
        private LocalTime endTime;
    }

    @Data
    public static class SeatViewDTO {
        private String name;
        private String seatType;
        private RoomViewDTO room;
    }

    @Data
    public static class RoomViewDTO {
        private String name;
        private CinemaViewDTO cinema;
    }

    @Data
    public static class CinemaViewDTO {
        private String name;
        private String address;
    }

    @Data
    public static class ShowtimeViewDTO {
        private LocalTime startTime;
        private LocalTime endTime;
        private LocalDate showDate;
    }
}

