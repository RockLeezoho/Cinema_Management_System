package com.javaweb.cinema.api.dto;

import com.javaweb.cinema.persistence.entity.Showtime;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data //Phai co @Data de Jackson co the serialize thanh JSON
@AllArgsConstructor
public class ShowtimeResponseDTO {

    private Long showtimeId;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate showDate;
    private Long movieId;
    private Long roomId;
    public ShowtimeResponseDTO(@NotNull Showtime showtime) {
        this.showtimeId = showtime.getShowtimeId();
        this.startTime = showtime.getStartTime();
        this.endTime = showtime.getEndTime();
        this.showDate = showtime.getShowDate();
        this.movieId = showtime.getMovie() != null ? showtime.getMovie().getMovieId() : null;
        this.roomId = showtime.getRoom() != null ? showtime.getRoom().getRoomId() : null;
    }
}
