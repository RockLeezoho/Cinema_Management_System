package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.persistence.entity.TicketType;
import com.javaweb.cinema.persistence.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    List<TicketType> findByVoucher(Voucher voucher);
}

