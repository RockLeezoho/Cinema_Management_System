package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.persistence.entity.InvoiceConcession;
import com.javaweb.cinema.persistence.entity.InvoiceConcessionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceConcessionRepository extends JpaRepository<InvoiceConcession, InvoiceConcessionId> {
}
