package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.RoomDTO;
import com.javaweb.cinema.api.dto.RoomResponseDTO;
import com.javaweb.cinema.api.dto.ShowtimeDTO;
import com.javaweb.cinema.api.dto.ShowtimeResponseDTO;
import com.javaweb.cinema.persistence.entity.Cinema;
import com.javaweb.cinema.persistence.entity.Movie;
import com.javaweb.cinema.persistence.entity.Room;
import com.javaweb.cinema.persistence.entity.Showtime;
import com.javaweb.cinema.persistence.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Service
public class ShowtimeService {
    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private MapperRepository mapperRepository;

    public ShowtimeDTO addShowtime(ShowtimeDTO showtimeDTO) {
        Showtime showtime = new Showtime();

        if (showtimeDTO.getStartTime() != null) {
            showtime.setStartTime(LocalTime.parse(showtimeDTO.getStartTime()));
        }

        if (showtimeDTO.getEndTime() != null) {
            showtime.setEndTime(LocalTime.parse(showtimeDTO.getEndTime()));
        }

        if (showtimeDTO.getShowDate() != null) {
            showtime.setShowDate(LocalDate.parse(showtimeDTO.getShowDate()));
        }

        if (showtimeDTO.getRoomId() != null) {
            Room room = roomRepository.findById(showtimeDTO.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng với ID: " + showtimeDTO.getRoomId()));
            showtime.setRoom(room);
        }

        if (showtimeDTO.getMovieId() != null) {
            Movie movie = movieRepository.findById(showtimeDTO.getMovieId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phim với ID: " + showtimeDTO.getMovieId()));
            showtime.setMovie(movie);
        }

        showtime = showtimeRepository.save(showtime);
        return mapperRepository.showtimeToShowtimeDTO(showtime);
    }


    public Optional<ShowtimeResponseDTO> updateShowtime(Long id, ShowtimeDTO showtimeDTO) {
        return showtimeRepository.findById(id).map(showtime -> {

            showtime.setStartTime(LocalTime.parse(showtimeDTO.getStartTime()));
            showtime.setEndTime(LocalTime.parse(showtimeDTO.getEndTime()));
            showtime.setShowDate(LocalDate.parse(showtimeDTO.getShowDate()));

            if (showtimeDTO.getMovieId() != null) {
                Movie movie = movieRepository.findById(showtimeDTO.getMovieId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp với ID: " + showtimeDTO.getMovieId()));
                showtime.setMovie(movie);
            }

            if (showtimeDTO.getRoomId() != null) {
                Room room = roomRepository.findById(showtimeDTO.getRoomId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp với ID: " + showtimeDTO.getRoomId()));
                showtime.setRoom(room);
            }

            Showtime updatedShowtime = showtimeRepository.save(showtime);
            return new ShowtimeResponseDTO(updatedShowtime);
        });
    }

//    public boolean deleteShowtime(Long id) {
//        return showtimeRepository.findById(id).map(showtime -> {
//            showtimeRepository.delete(showtime);
//            return true;
//        }).orElse(false);
//    }

    public Optional<Showtime> findShowtimeById(Long id) {
        return showtimeRepository.findById(id);
    }

    public Page<ShowtimeDTO> findShowtimes(Pageable pageable) {
        Page<Showtime> showtimes = showtimeRepository.findAll(pageable);
        return showtimes.map(mapperRepository::showtimeToShowtimeDTO);
    }

}
