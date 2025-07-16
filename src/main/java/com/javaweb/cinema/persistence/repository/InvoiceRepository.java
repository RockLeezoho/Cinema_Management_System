package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.persistence.entity.Invoice;
import com.javaweb.cinema.service.InvoiceService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}
