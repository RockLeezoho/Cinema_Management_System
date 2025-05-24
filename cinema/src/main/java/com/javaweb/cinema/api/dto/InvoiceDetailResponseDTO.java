package com.javaweb.cinema.api.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class InvoiceDetailResponseDTO {
        private Long invoiceId;
        private LocalDate paymentDate;
        private String paymentMethod;
        private UserViewDTO user;
        private List<ConcessionViewDTO> concessions;

    @Data
    public static class UserViewDTO {
        private String name;
        private String username;
        private String phone;
        private String email;
    }

    @Data
    public static class ConcessionViewDTO {
        private String name;
        private String type;
        private Double sellingPrice;
        private Integer quantity;
    }
}



