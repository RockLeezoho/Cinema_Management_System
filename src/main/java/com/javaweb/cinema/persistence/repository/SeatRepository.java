package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.persistence.entity.Room;
import com.javaweb.cinema.persistence.entity.Seat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    Page<Seat> findByRoom_RoomId(Long roomId, Pageable pageable);
    Optional<Seat> findByNameAndRoom(String name, Room room);
    Optional<Seat> findByName(String name);
}
