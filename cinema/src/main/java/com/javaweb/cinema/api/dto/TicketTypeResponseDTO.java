package com.javaweb.cinema.api.dto;

import com.javaweb.cinema.persistence.entity.TicketType;
import com.javaweb.cinema.persistence.repository.TicketTypeRepository;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TicketTypeResponseDTO {

    private String name;
    private Double price;
    private Long voucherId;

    public TicketTypeResponseDTO(@NotNull TicketType ticketType) {
        this.name = ticketType.getName();
        this.price = ticketType.getPrice();
        this.voucherId = ticketType.getVoucher() != null ? ticketType.getVoucher().getVoucherId() : null;
    }
}
