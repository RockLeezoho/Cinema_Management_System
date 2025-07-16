package com.javaweb.cinema.api.controller.customer;
import com.javaweb.cinema.api.dto.*;
import com.javaweb.cinema.common.exception.ResourceNotFoundException;
import com.javaweb.cinema.persistence.entity.Room;
import com.javaweb.cinema.service.*;
import com.javaweb.cinema.storage.BookingStorage;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/cinpenut/booking")
public class BookingController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private TicketTypeService ticketTypeService;

    @Autowired
    private ConcessionService concessionService;

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private VnPayService vnpayService;

    @Autowired
    private BookingStorage bookingStorage;

    @GetMapping("movies/{movieId}")
    public ResponseEntity<?> getMovieDetail(@PathVariable Long movieId) {
        Optional<MovieDTO> movieOptional = movieService.findMovieById(movieId);

        if (movieOptional.isPresent()) {
            return ResponseEntity.ok(movieOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/cinemas")
    public ResponseEntity<?> getCinemasByMovieAndDate(
            @RequestParam Long movieId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate showDate
    ) {
        List<CinemaDTO> cinemas = bookingService.getCinemasByMovieAndDate(movieId, showDate);
        if (cinemas.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy rạp nào chiếu phim này vào ngày yêu cầu.");
        }
        return ResponseEntity.ok(cinemas);
    }

    @GetMapping("/showtimes")
    public ResponseEntity<?> getShowtimesByMovieCinemaAndDate(
            @RequestParam Long movieId,
            @RequestParam Long cinemaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate showDate
    ) {
        List<Map<String, Object>> showtimes = bookingService.getShowtimesByMovieCinemaAndDate(movieId, cinemaId, showDate);

        if (showtimes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không có suất chiếu cho phim, rạp và ngày đã chọn.");
        }

        return ResponseEntity.ok(showtimes);
    }

    @GetMapping("/tickettypes")
    public ResponseEntity<?> getAllTicketTypes() {
        List<TicketTypeDTO> ticketTypes = ticketTypeService.getAllTicketTypes();

        if (ticketTypes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không có loại vé nào.");
        }

        return ResponseEntity.ok(ticketTypes);
    }

    @GetMapping("/seats/status")
    public ResponseEntity<?> getSeatBookingStatus(
            @RequestParam Long showtimeId,
            @RequestParam Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate showDate
    ) {
        List<SeatBookingStatusDTO> seatStatusList = bookingService.getSeatBookingStatus(showtimeId, roomId);

        if (seatStatusList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy ghế cho phòng chiếu yêu cầu.");
        }

        return ResponseEntity.ok(seatStatusList);
    }

    @GetMapping("/concessions")
    public ResponseEntity<?> getAvailableConcessions(@RequestParam Long cinemaId) {
        List<ConcessionDTO> concessions = concessionService.getAvailableConcessions(cinemaId);

        if (concessions.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy bắp nước nào cho rạp yêu cầu.");
        }

        return ResponseEntity.ok(concessions);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/payment/create")
    public ResponseEntity<?> createPayment(@RequestBody BookingDetailDTO bookingDetailDTO) {
        try {
            String bookingId = UUID.randomUUID().toString();
            bookingStorage.save(bookingId, bookingDetailDTO);

            bookingService.saveBooking(bookingDetailDTO);
            String paymentUrl = vnpayService.createPayment(bookingDetailDTO, bookingId);
            Map<String, String> response = new HashMap<>();
            response.put("paymentUrl", paymentUrl);
            System.out.println(response);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo thanh toán!");
        }
    }

    @GetMapping("payment/result")
    public ResponseEntity<?> returnPayment(@RequestParam("vnp_ResponseCode") String responseCode,
                                           @RequestParam("vnp_TxnRef") String bookingId) {
        return vnpayService.handlePaymentReturn(responseCode, bookingId);
    }

}
