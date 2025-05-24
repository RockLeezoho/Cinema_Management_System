package com.javaweb.cinema.api.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConcessionDTO {

    private Long id;
    private String image;
    private String name;
    private String type;
    private Double importPrice;
    private Double sellingPrice;
    private Long quantity;
    private Long supplierId;
    private Long voucherId;
    private List<Long> cinemaIds;

    public ConcessionDTO(Long id, String image, String name, String type, Double sellingPrice, Long quantity, Long voucherId) {
        this.id = id;
        this.image = image;
        this.name = name;
        this.type = type;
        this.sellingPrice = sellingPrice;
        this.quantity = quantity;
        this.voucherId = voucherId;
    }
}
