package com.javaweb.cinema.api.dto;
import lombok.Data;

@Data
public class TicketTypeDTO {

    private Long id;
    private String name;
    private Double price;
    private Long voucherId;
}
