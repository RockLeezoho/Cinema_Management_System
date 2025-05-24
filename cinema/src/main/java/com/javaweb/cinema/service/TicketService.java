package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.TicketDetailResponseDTO;
import com.javaweb.cinema.api.dto.TicketResponseDTO;
import com.javaweb.cinema.api.dto.TicketTypeDTO;
import com.javaweb.cinema.persistence.entity.Ticket;
import com.javaweb.cinema.persistence.entity.TicketType;
import com.javaweb.cinema.persistence.repository.TicketRepository;
import com.javaweb.cinema.persistence.repository.TicketTypeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TicketRepository ticketRepository;

    public Optional<TicketDetailResponseDTO> findTicketById(Long id) {
        return ticketRepository.findById(id)
                .map(ticket -> modelMapper.map(ticket, TicketDetailResponseDTO.class));
    }

    public Page<TicketResponseDTO> findTickets(Pageable pageable) {
        Page<Ticket> tickets = ticketRepository.findAll(pageable);
        return tickets.map(ticket -> {
            TicketResponseDTO dto = new TicketResponseDTO();
            dto.setTicketId(ticket.getTicketId());
            dto.setMovieName(ticket.getShowtime().getMovie().getTitle());
            dto.setFullName(ticket.getUser().getUsername());
            dto.setUsername(ticket.getUser().getName());
            dto.setTicketType(ticket.getTicketType().getName());
            dto.setTicketPrice(ticket.getTicketType().getPrice());
            dto.setSeatName(ticket.getSeat().getName());
            dto.setStartTime(ticket.getShowtime().getStartTime());

            return dto;
        });
    }

}
