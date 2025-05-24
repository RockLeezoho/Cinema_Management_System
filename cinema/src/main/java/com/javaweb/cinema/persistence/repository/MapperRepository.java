package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.api.dto.*;
import com.javaweb.cinema.persistence.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface MapperRepository {

    UserDTO userToUserDTO(User user);
    User userDTOToUser(UserDTO userDTO);

    MovieDTO movieToMovieDTO(Movie movie);

    @Mapping(source = "cinemaId", target = "id")
    CinemaDTO cinemaToCinemaDTO(Cinema cinema);

    @Mapping(source = "cinema.cinemaId", target = "cinemaId")
    RoomDTO roomToRoomDTO(Room room);

    @Mapping(target = "cinema.cinemaId", source = "cinemaId")
    Room roomDTOToRoom(RoomDTO roomDTO);

    @Mapping(source = "room.roomId", target = "roomId")
    SeatDTO seatToSeatDTO(Seat seat);

    @Mapping(target = "room.roomId", source = "roomId")
    Seat seatDTOToSeat(SeatDTO seatDTO);

    @Mappings({
            @Mapping(source = "room.roomId", target = "roomId"),
            @Mapping(source = "movie.movieId", target = "movieId")
    })
    ShowtimeDTO showtimeToShowtimeDTO(Showtime showtime);

    @Mappings({
            @Mapping(source = "roomId", target = "room.roomId"),
            @Mapping(source = "movieId", target = "movie.movieId")
    })
    Showtime showtimeDTOToShowtime(ShowtimeDTO showtimeDTO);

    @Mapping(source = "voucherId", target = "id")
    VoucherDTO voucherToVoucherDTO(Voucher voucher);

    @Mapping(source = "supplierId", target = "id")
    SupplierDTO supplierToSupplierDTO(Supplier supplier);

    @Mapping(source = "supplier.supplierId", target = "supplierId")
    @Mapping(source = "voucher.voucherId", target = "voucherId")
    ConcessionDTO concessionToDTO(Concession concession);

    @Mapping(target = "supplier.supplierId", source = "supplierId")
    @Mapping(target = "voucher.voucherId", source = "voucherId")
    Concession concessionDTOToConcession(ConcessionDTO dto);

    @Mapping(source = "ticketTypeId", target = "id")
    @Mapping(source = "voucher.voucherId", target = "voucherId")
    TicketTypeDTO ticketTypeToTicketTypeDTO(TicketType ticketType);

    @Mapping(source = "id", target = "ticketTypeId")
    @Mapping(target = "voucher.voucherId", source = "voucherId")
    TicketType ticketTypeDTOToTicketType(TicketTypeDTO ticketTypeDTO);
}
