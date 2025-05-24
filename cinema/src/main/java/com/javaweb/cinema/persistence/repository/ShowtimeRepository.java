package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.persistence.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    @Query("SELECT s.id, s.startTime, s.endTime, s.showDate, " +
            "r.id, r.name, c.id, c.name " +
            "FROM Showtime s " +
            "JOIN s.room r " +
            "JOIN r.cinema c " +
            "WHERE s.movie.id = :movieId " +
            "AND c.id = :cinemaId " +
            "AND s.showDate = :showDate")
    List<Object[]> findShowtimesByMovieCinemaAndDate(@Param("movieId") Long movieId,
                                                     @Param("cinemaId") Long cinemaId,
                                                     @Param("showDate") LocalDate showDate);

    @Query(value = """
    SELECT s.id AS seatId, s.name AS seatName, s.seatType AS seatType,
           CASE WHEN t.id IS NULL THEN 'AVAILABLE' ELSE 'BOOKED' END AS status
    FROM seat s
    LEFT JOIN ticket t 
      ON t.seatId = s.id 
     AND t.showtimeId = :showtimeId
    WHERE s.roomId = :roomId
    ORDER BY s.name
    """, nativeQuery = true)
    List<Object[]> findSeatStatusByShowtimeAndRoom(
            @Param("showtimeId") Long showtimeId,
            @Param("roomId") Long roomId
    );


}
