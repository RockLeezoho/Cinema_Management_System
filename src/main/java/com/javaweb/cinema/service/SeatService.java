package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.*;
import com.javaweb.cinema.common.exception.RoomNotFoundException;
import com.javaweb.cinema.persistence.entity.Room;
import com.javaweb.cinema.persistence.entity.Seat;
import com.javaweb.cinema.persistence.repository.RoomRepository;
import com.javaweb.cinema.persistence.repository.MapperRepository;
import com.javaweb.cinema.persistence.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private MapperRepository mapperRepository;

    public SeatDTO addSeat(SeatDTO seatDTO) {
        Seat seat = mapperRepository.seatDTOToSeat(seatDTO);

        if (seatDTO.getRoomId() != null) {
            Room room = roomRepository.findById(seatDTO.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy chỗ ngồi với ID: " + seatDTO.getRoomId()));
            seat.setRoom(room);
        }

        seat = seatRepository.save(seat);
        return mapperRepository.seatToSeatDTO(seat);
    }

    public Optional<SeatResponseDTO> updateSeat(Long id, SeatDTO seatDTO) {
        return seatRepository.findById(id).map(seat -> {

            if (seatDTO.getImage() != null && !seatDTO.getImage().isEmpty()) {
                seat.setImage(seatDTO.getImage());
            }
            seat.setName(seatDTO.getName());
            seat.setSeatType(seatDTO.getSeatType());

            if (seatDTO.getRoomId() != null) {
                Room room = roomRepository.findById(seatDTO.getRoomId())
                        .orElseThrow(() -> new RoomNotFoundException(seatDTO.getRoomId()));
                seat.setRoom(room);
            }

            Seat updatedseat = seatRepository.save(seat);
            return new SeatResponseDTO(updatedseat);
        });
    }

//    public boolean deleteSeat(Long id) {
//        return seatRepository.findById(id).map(seat -> {
//            seatRepository.delete(seat);
//            return true;
//        }).orElse(false);
//    }

    public Optional<Seat> findSeatById(Long id) {
        return seatRepository.findById(id);
    }

    public Page<SeatDTO> findSeats(Long roomId, Pageable pageable) {
        Page<Seat> seats;

        if (roomId != null) {
            seats = seatRepository.findByRoom_RoomId(roomId, pageable);
        } else {
            seats = seatRepository.findAll(pageable);
        }
        return seats.map(mapperRepository::seatToSeatDTO);
    }
}
