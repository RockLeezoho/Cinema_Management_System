package com.javaweb.cinema.api.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketTypeDTO {

    private Long ticketTypeId;
    private String name;
    private Double price;
    private Long voucherId;
}
