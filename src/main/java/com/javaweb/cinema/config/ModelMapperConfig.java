package com.javaweb.cinema.config;

import com.javaweb.cinema.api.dto.*;
import com.javaweb.cinema.persistence.entity.*;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper1 = new ModelMapper();

        modelMapper1.typeMap(Ticket.class, TicketDTO.class);
        modelMapper1.typeMap(User.class, UserDTO.class);
        modelMapper1.typeMap(TicketType.class, TicketTypeDTO.class);
        modelMapper1.typeMap(Seat.class, SeatDTO.class);
        modelMapper1.typeMap(Room.class, RoomDTO.class);
        modelMapper1.typeMap(Cinema.class, CinemaDTO.class);
        modelMapper1.typeMap(Showtime.class, ShowtimeDTO.class);

        return modelMapper1;
    }
}
