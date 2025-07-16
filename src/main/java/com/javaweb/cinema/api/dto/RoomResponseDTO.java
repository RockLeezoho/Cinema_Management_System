package com.javaweb.cinema.api.dto;

import com.javaweb.cinema.persistence.entity.Cinema;
import com.javaweb.cinema.persistence.entity.Room;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data //Phai co @Data de Jackson co the serialize thanh JSON
@AllArgsConstructor
public class RoomResponseDTO {
    private Long roomId;
    private String image;
    private String name;
    private Integer numberOfSeats;
    private Long cinemaId;

    public RoomResponseDTO(@NotNull Room room) {
        this.roomId = room.getRoomId();
        this.name = room.getName();
        this.image = room.getImage();
        this.numberOfSeats = room.getNumberOfSeats();
        this.cinemaId = room.getCinema() != null ? room.getCinema().getCinemaId() : null;
    }
}
