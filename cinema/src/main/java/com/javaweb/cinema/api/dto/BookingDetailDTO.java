package com.javaweb.cinema.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetailDTO {

    private String customerName;
    private String customerPhone;
    private String customerEmail;

    private String paymentMethod;
    private LocalDate paymentDate;
    private Long showtimeId;
    private List<ItemQuantity> ticketTypeId;
    private List<Long> selectedSeatsId;
    private List<ItemQuantity> concessionsId;
}
