package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.persistence.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
}
