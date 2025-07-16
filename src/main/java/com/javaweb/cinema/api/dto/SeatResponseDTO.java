package com.javaweb.cinema.api.dto;

import com.javaweb.cinema.persistence.entity.Seat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SeatResponseDTO {
    private Long roomId;
    private String image;
    private String name;
    private String seatType;
    private Long seatId;

    public SeatResponseDTO(@NotNull Seat seat) {
        this.seatId = seat.getSeatId();
        this.name = seat.getName();
        this.image = seat.getImage();
        this.seatType = seat.getSeatType();
        this.roomId = seat.getRoom() != null ? seat.getRoom().getRoomId() : null;
    }
}
