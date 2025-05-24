package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.api.dto.*;
import com.javaweb.cinema.persistence.entity.Seat;
import com.javaweb.cinema.persistence.repository.SeatRepository;
import com.javaweb.cinema.service.SeatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/_adminv1-cinpenut")
public class SeatManagementController {

    @Autowired
    private SeatService seatService;

    @Autowired
    private SeatRepository seatRepository;

    @GetMapping("/seats/{id}")
    public ResponseEntity<?> searchSeatById(@PathVariable Long id) {
        Optional<Seat> seatOptional = seatService.findSeatById(id);

        if (seatOptional.isPresent()) {
            Seat seat = seatOptional.get();
            SeatResponseDTO seatDTO = new SeatResponseDTO(seat);
            System.out.println("seatDTO: " + seatDTO);
            return ResponseEntity.ok(seatDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/seats")
    public ResponseEntity<?> getAllSeats(@RequestParam int page,
                                         @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("seatId").ascending());
        Page<SeatDTO> seats = seatService.findSeats(pageable);
        return ResponseEntity.ok(seats);
    }

    @PostMapping("/seats")
    public ResponseEntity<?> createSeat(@RequestBody SeatDTO seatDTO){
        try {
            SeatDTO createdSeat = seatService.addSeat(seatDTO);
            System.out.println("Received seatDTO: " + createdSeat);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdSeat);
        } catch (IllegalArgumentException e) {
            // Loi validate (username da ton tai)
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Loi khong xac dinh
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo chỗ ngồi.");
        }
    }

    @PutMapping("seats/{id}")
    public ResponseEntity<?> updateSeat(@PathVariable Long id, @RequestBody SeatDTO seatDTO) {
        Optional<SeatResponseDTO> updated = seatService.updateSeat(id, seatDTO);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            return ResponseEntity.status(404).body("chỗ ngồi không tồn tại");
        }
    }

//    @DeleteMapping("seats/{id}")
//    public ResponseEntity<String> deleteSeat(@PathVariable Long id) {
//        boolean deleted = seatService.deleteSeat(id);
//        if (deleted) {
//            return ResponseEntity.ok("Xóa chỗ ngồi thành công");
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy chỗ ngồi để xóa");
//        }
//    }

}
