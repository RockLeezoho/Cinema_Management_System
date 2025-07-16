package com.javaweb.cinema.common.exception;

public class RoomNotFoundException extends RuntimeException {
    public RoomNotFoundException(Long roomId) {
        super("Không tìm thấy phòng với ID: " + roomId);
    }
}
