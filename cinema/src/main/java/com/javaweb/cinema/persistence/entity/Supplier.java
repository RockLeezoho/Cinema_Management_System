package com.javaweb.cinema.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "supplier")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long supplierId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "supplieditems", nullable = false, columnDefinition = "TEXT")
    private String suppliedItems;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "contractstartdate", nullable = false)
    private LocalDate contractStartDate;

    @Column(name = "contractenddate", nullable = false)
    private LocalDate contractEndDate;
}
