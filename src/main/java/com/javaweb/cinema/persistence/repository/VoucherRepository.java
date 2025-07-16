package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.persistence.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {

    List<Voucher> findTop6ByOrderByVoucherIdAsc();
}
