package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.api.dto.ConcessionDTO;
import com.javaweb.cinema.persistence.entity.Concession;
import com.javaweb.cinema.persistence.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConcessionRepository extends JpaRepository<Concession, Long> {
    List<Concession> findByNameAndTypeAndSupplier(String name, String type, Supplier supplier);


}

