package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.CinemaDTO;
import com.javaweb.cinema.api.dto.RoomDTO;
import com.javaweb.cinema.api.dto.SeatBookingStatusDTO;
import com.javaweb.cinema.persistence.entity.Cinema;
import com.javaweb.cinema.persistence.entity.Room;
import com.javaweb.cinema.persistence.repository.CinemaRepository;
import com.javaweb.cinema.persistence.repository.RoomRepository;
import com.javaweb.cinema.persistence.repository.ShowtimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    public List<CinemaDTO> getCinemasByMovieAndDate(Long movieId, LocalDate showDate) {
        // Lấy danh sách phòng chiếu có phim và ngày yêu cầu
        List<Room> rooms = roomRepository.findRoomsByMovieAndDate(movieId, showDate);

        // Dùng Set để loại bỏ các rạp bị trùng lặp (một rạp có nhiều phòng chiếu)
        Set<Cinema> cinemas = rooms.stream()
                .map(Room::getCinema)
                .collect(Collectors.toCollection(LinkedHashSet::new)); // giữ thứ tự và loại bỏ trùng

        // Chuyển sang danh sách CinemaDTO để trả về frontend
        return cinemas.stream()
                .map(cinema -> new CinemaDTO(
                        cinema.getCinemaId(),
                        cinema.getName(),
                        cinema.getAddress(),
                        cinema.getImage()
                ))
                .collect(Collectors.toList());
    }


    public List<Map<String, Object>> getShowtimesByMovieCinemaAndDate(Long movieId, Long cinemaId, LocalDate showDate) {
        List<Object[]> rawData = showtimeRepository.findShowtimesByMovieCinemaAndDate(movieId, cinemaId, showDate);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : rawData) {
            Map<String, Object> item = new HashMap<>();
            item.put("showtimeId", row[0]);
            item.put("startTime", row[1].toString());
            item.put("endTime", row[2].toString());
            item.put("showDate", row[3].toString());
            item.put("roomId", row[4]);
            item.put("roomName", row[5]);
            item.put("cinemaId", row[6]);
            item.put("cinemaName", row[7]);

            result.add(item);
        }

        return result;
    }


    public List<SeatBookingStatusDTO> getSeatBookingStatus(Long showtimeId, Long roomId) {
        List<Object[]> rawData = showtimeRepository.findSeatStatusByShowtimeAndRoom(showtimeId, roomId);

        List<SeatBookingStatusDTO> result = new ArrayList<>();

        for (Object[] row : rawData) {
            SeatBookingStatusDTO dto = new SeatBookingStatusDTO();
            dto.setSeatId(((Number) row[0]).longValue());
            dto.setName((String) row[1]);
            dto.setSeatType((String) row[2]);
            dto.setBooked("BOOKED".equalsIgnoreCase((String) row[3]));

            result.add(dto);
        }

        return result;
    }





}

