package com.javaweb.cinema.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InvoiceResponseDTO {

    private Long invoiceId;
    private String paymentMethod;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate paymentDate;
    private String username;
    private String fullName;
    private Double totalAmount;
}
