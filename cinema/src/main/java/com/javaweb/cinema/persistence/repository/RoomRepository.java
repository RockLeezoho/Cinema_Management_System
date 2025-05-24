package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.persistence.entity.Room;
import com.javaweb.cinema.persistence.entity.Cinema;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("SELECT DISTINCT s.room FROM Showtime s " +
            "WHERE s.movie.id = :movieId AND s.showDate = :showDate")
    List<Room> findRoomsByMovieAndDate(@Param("movieId") Long movieId,
                                       @Param("showDate") LocalDate showDate);
}
