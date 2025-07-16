package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.*;
import com.javaweb.cinema.persistence.entity.*;
import com.javaweb.cinema.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private TicketTypeRepository ticketTypeRepository;
    @Autowired
    private SeatRepository seatRepository;
    @Autowired
    private ConcessionRepository concessionRepository;
    @Autowired
    private InvoiceConcessionRepository invoiceConcessionRepository;


    public List<CinemaDTO> getCinemasByMovieAndDate(Long movieId, LocalDate showDate) {
        // Lay danh sach phong chieu co phim va ngay yeu cau
        List<Room> rooms = roomRepository.findRoomsByMovieAndDate(movieId, showDate);

        // Dung Set de loai bo cac rap bi trung lap (mot rap co nhieu phong chieu)
        Set<Cinema> cinemas = rooms.stream()
                .map(Room::getCinema)
                .collect(Collectors.toCollection(LinkedHashSet::new)); // giu thu tu va loai bo trung


        return cinemas.stream()
                .map(cinema -> new CinemaDTO(
                        cinema.getCinemaId(),
                        cinema.getName(),
                        cinema.getAddress(),
                        cinema.getImage()
                ))
                .collect(Collectors.toList());
    }


    public List<Map<String, Object>> getShowtimesByMovieCinemaAndDate(Long movieId, Long cinemaId, LocalDate showDate) {
        List<Object[]> rawData = showtimeRepository.findShowtimesByMovieCinemaAndDate(movieId, cinemaId, showDate);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : rawData) {
            Map<String, Object> item = new HashMap<>();
            item.put("showtimeId", row[0]);
            item.put("startTime", row[1].toString());
            item.put("endTime", row[2].toString());
            item.put("showDate", row[3].toString());
            item.put("roomId", row[4]);
            item.put("roomName", row[5]);
            item.put("cinemaId", row[6]);
            item.put("cinemaName", row[7]);

            result.add(item);
        }

        return result;
    }


    public List<SeatBookingStatusDTO> getSeatBookingStatus(Long showtimeId, Long roomId) {
        List<Object[]> rawData = showtimeRepository.findSeatStatusByShowtimeAndRoom(showtimeId, roomId);

        List<SeatBookingStatusDTO> result = new ArrayList<>();

        for (Object[] row : rawData) {
            SeatBookingStatusDTO dto = new SeatBookingStatusDTO();
            dto.setSeatId(((Number) row[0]).longValue());
            dto.setName((String) row[1]);
            dto.setSeatType((String) row[2]);
            dto.setBooked("BOOKED".equalsIgnoreCase((String) row[3]));

            result.add(dto);
        }

        result.sort(Comparator.comparingLong(SeatBookingStatusDTO::getSeatId));
        return result;
    }

    public void saveBooking(BookingDetailDTO bookingDetailDTO) {
        // 1. Tìm hoặc tạo mới user
        User user = userRepository.findByPhone(bookingDetailDTO.getCustomerPhone())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setName(bookingDetailDTO.getCustomerName());
                    newUser.setPhone(bookingDetailDTO.getCustomerPhone());
                    newUser.setEmail(bookingDetailDTO.getCustomerEmail());
                    newUser.setRole("GUEST");
                    return userRepository.save(newUser);
                });

        // 2. Tạo invoice
        Invoice invoice = new Invoice();
        invoice.setUser(user);
        invoice.setPaymentMethod(bookingDetailDTO.getPaymentMethod());
        invoice.setPaymentDate(
                bookingDetailDTO.getPaymentDate() != null ?
                        bookingDetailDTO.getPaymentDate() :
                        LocalDate.now()
        );
        invoice = invoiceRepository.save(invoice);

        // 3. Lấy thông tin showtime
        Showtime showtime = showtimeRepository.findById(bookingDetailDTO.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Suất chiếu không tồn tại"));

        // 4. Lấy thông tin loại vé
        TicketType ticketType = ticketTypeRepository.findById(bookingDetailDTO.getTicketTypeId())
                .orElseThrow(() -> new RuntimeException("Loại vé không tồn tại"));

        // 5. Tìm seat theo tên và phòng từ showtime
        Room room = showtime.getRoom();
        Seat seat = seatRepository.findByNameAndRoom(bookingDetailDTO.getSelectedSeatName(), room)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ghế với tên: " + bookingDetailDTO.getSelectedSeatName()));

        // 6. Tạo ticket (vé)
        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setPaymentMethod(bookingDetailDTO.getPaymentMethod());
        ticket.setPaymentDate(invoice.getPaymentDate());
        ticket.setTicketType(ticketType);
        ticket.setSeat(seat);
        ticket.setShowtime(showtime);
        ticketRepository.save(ticket);

        // 7. Tạo danh sách sản phẩm ăn uống (invoice_concession)
        for (ItemQuantity item : bookingDetailDTO.getConcessionsId()) {
            Concession concession = concessionRepository.findById(item.getId())
                    .orElseThrow(() -> new RuntimeException("Concession không tồn tại"));

            InvoiceConcession invoiceConcession = new InvoiceConcession();
            invoiceConcession.setInvoice(invoice);
            invoiceConcession.setConcession(concession);
            invoiceConcession.setQuantity(item.getQuantity());

            invoiceConcessionRepository.save(invoiceConcession);
        }
    }


}

