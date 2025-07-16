package com.javaweb.cinema.storage;

import com.javaweb.cinema.api.dto.BookingDetailDTO;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class BookingStorage {
    private final Map<String, BookingDetailDTO> tempBookings = new ConcurrentHashMap<>();

    public void save(String bookingId, BookingDetailDTO bookingDetailDTO) {
        tempBookings.put(bookingId, bookingDetailDTO);
    }

    public BookingDetailDTO get(String bookingId) {
        return tempBookings.get(bookingId);
    }

    public void remove(String bookingId) {
        tempBookings.remove(bookingId);
    }
}

