package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.api.dto.*;
import com.javaweb.cinema.persistence.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MapperRepository {


    UserDTO userToUserDTO(User user);
    User userDTOToUser(UserDTO userDTO);

    CinemaDTO cinemaToCinemaDTO(Cinema cinema);

    @Mappings({
            @Mapping(source = "roomId", target = "roomId"),
            @Mapping(source = "cinema.cinemaId", target = "cinemaId")
    })
    RoomDTO roomToRoomDTO(Room room);

    @Mapping(target = "cinema.cinemaId", source = "cinemaId")
    Room roomDTOToRoom(RoomDTO roomDTO);

    @Mappings({
            @Mapping(source = "seatId", target = "seatId"),
            @Mapping(source = "room.roomId", target = "roomId")
    })
    SeatDTO seatToSeatDTO(Seat seat);

    @Mapping(target = "room.roomId", source = "roomId")
    Seat seatDTOToSeat(SeatDTO seatDTO);

    @Mappings({
            @Mapping(source = "room.roomId", target = "roomId"),
            @Mapping(source = "movie.movieId", target = "movieId"),
            @Mapping(source = "showtimeId", target = "showtimeId"),
    })
    ShowtimeDTO showtimeToShowtimeDTO(Showtime showtime);

    @Mappings({
            @Mapping(source = "roomId", target = "room.roomId"),
            @Mapping(source = "movieId", target = "movie.movieId"),
            @Mapping(source = "showtimeId", target = "showtimeId"),
    })
    Showtime showtimeDTOToShowtime(ShowtimeDTO showtimeDTO);

    @Mapping(target = "voucherId", source = "voucherId")
    VoucherDTO voucherToVoucherDTO(Voucher voucher);

    SupplierDTO supplierToSupplierDTO(Supplier supplier);

    @Mappings({
            @Mapping(source = "supplier.supplierId", target = "supplierId"),
            @Mapping(source = "voucher.voucherId", target = "voucherId"),
            @Mapping(source = "concessionId", target = "concessionId")
    })
    ConcessionDTO concessionToConcessionDTO(Concession concession);

    @Mappings({
            @Mapping(target = "supplier.supplierId", source = "supplierId"),
            @Mapping(target = "voucher.voucherId", source = "voucherId"),
            @Mapping(source = "concessionId", target = "concessionId")
    })
    Concession concessionDTOToConcession(ConcessionDTO dto);

    @Mapping(source = "ticketTypeId", target = "ticketTypeId")
    @Mapping(source = "voucher.voucherId", target = "voucherId")
    TicketTypeDTO ticketTypeToTicketTypeDTO(TicketType ticketType);

    @Mapping(source = "ticketTypeId", target = "ticketTypeId")
    @Mapping(target = "voucher.voucherId", source = "voucherId")
    TicketType ticketTypeDTOToTicketType(TicketTypeDTO ticketTypeDTO);

    MovieDTO movieToMovieDTO(Movie movie);

    List<MovieDTO> movieToMovieDTOs(List<Movie> movies);

    List<VoucherDTO> voucherToVoucherDTOs(List<Voucher> vouchers);

    List<ConcessionDTO> concessionToConcessionDTOs(List<Concession> concessions);
}
