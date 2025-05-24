package com.javaweb.cinema.persistence.entity;

import java.io.Serializable;
import java.util.Objects;

public class InvoiceConcessionId implements Serializable {

    private Long invoice;
    private Long concession;

    public InvoiceConcessionId() {}

    public InvoiceConcessionId(Long invoice, Long concession) {
        this.invoice = invoice;
        this.concession = concession;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof InvoiceConcessionId)) return false;
        InvoiceConcessionId that = (InvoiceConcessionId) o;
        return Objects.equals(invoice, that.invoice) &&
                Objects.equals(concession, that.concession);
    }

    @Override
    public int hashCode() {
        return Objects.hash(invoice, concession);
    }
}
