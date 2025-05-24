package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.CinemaDTO;
import com.javaweb.cinema.api.dto.RoomDTO;
import com.javaweb.cinema.api.dto.RoomResponseDTO;
import com.javaweb.cinema.persistence.entity.Cinema;
import com.javaweb.cinema.persistence.entity.Room;
import com.javaweb.cinema.persistence.repository.CinemaRepository;
import com.javaweb.cinema.persistence.repository.RoomRepository;
import com.javaweb.cinema.persistence.repository.MapperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private CinemaRepository cinemaRepository;

    @Autowired
    private MapperRepository mapperRepository;

    public RoomDTO addRoom(RoomDTO roomDTO) {
        Room room = mapperRepository.roomDTOToRoom(roomDTO);

        if (roomDTO.getCinemaId() != null) {
            Cinema cinema = cinemaRepository.findById(roomDTO.getCinemaId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy rạp với ID: " + roomDTO.getCinemaId()));
            room.setCinema(cinema);
        }

        room = roomRepository.save(room);
        return mapperRepository.roomToRoomDTO(room);
    }

    public Optional<RoomResponseDTO> updateRoom(Long id, RoomDTO roomDTO) {
        return roomRepository.findById(id).map(room -> {

            room.setName(roomDTO.getName());
            room.setNumberOfSeats(roomDTO.getNumberOfSeats());
            room.setImage(roomDTO.getImage());

            if (roomDTO.getCinemaId() != null) {
                Cinema cinema = cinemaRepository.findById(roomDTO.getCinemaId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp với ID: " + roomDTO.getCinemaId()));
                room.setCinema(cinema);
            }

            Room updatedRoom = roomRepository.save(room);
            return new RoomResponseDTO(updatedRoom);
        });
    }

//    public boolean deleteRoom(Long id) {
//        return roomRepository.findById(id).map(room -> {
//            roomRepository.delete(room);
//            return true;
//        }).orElse(false);
//    }

    public Optional<Room> findRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Page<RoomDTO> findRooms(Pageable pageable) {
        Page<Room> rooms = roomRepository.findAll(pageable);
        return rooms.map(mapperRepository::roomToRoomDTO);
    }
}
