package com.javaweb.cinema.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "invoice")
@Data
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id", nullable = false, updatable = false)
    private Long invoiceId;

    @Column(name = "paymentmethod", nullable = false)
    private String paymentMethod;

    @Column(name = "paymentdate", nullable = false)
    private LocalDate paymentDate;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
    private List<InvoiceConcession> invoiceConcessions;

}

