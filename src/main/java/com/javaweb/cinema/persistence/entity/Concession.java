package com.javaweb.cinema.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "concession")
public class Concession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long concessionId;

    @Column(name = "image")
    private String image;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "importprice", nullable = false)
    private Double importPrice;

    @Column(name = "sellingprice", nullable = false)
    private Double sellingPrice;

    @Column(name = "quantity", nullable = false)
    private Long quantity;

    @ManyToOne
    @JoinColumn(name = "supplierid", nullable = false)
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "voucherid")
    private Voucher voucher;
}
