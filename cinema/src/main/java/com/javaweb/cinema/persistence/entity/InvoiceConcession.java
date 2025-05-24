package com.javaweb.cinema.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "invoice_concession")
@Data
@IdClass(InvoiceConcessionId.class)
public class InvoiceConcession {

    @Id
    @ManyToOne
    @JoinColumn(name = "invoiceid", nullable = false)
    private Invoice invoice;

    @Id
    @ManyToOne
    @JoinColumn(name = "concessionid", nullable = false)
    private Concession concession;

    @Column(nullable = false)
    private int quantity;

}
