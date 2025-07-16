package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.api.dto.ShowtimeDTO;
import com.javaweb.cinema.api.dto.ShowtimeResponseDTO;
import com.javaweb.cinema.persistence.entity.Showtime;
import com.javaweb.cinema.service.ShowtimeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/_adminv1-cinpenut")
public class ShowtimeManagementController {

    @Autowired
    private ShowtimeService showtimeService;

    @GetMapping("/showtimes/{id}")
    public ResponseEntity<?> searchShowtimeById(@PathVariable Long id) {
        Optional<Showtime> showtimeOptional = showtimeService.findShowtimeById(id);

        if (showtimeOptional.isPresent()) {
            Showtime showtime = showtimeOptional.get();
            ShowtimeResponseDTO showtimeDTO = new ShowtimeResponseDTO(showtime);
            return ResponseEntity.ok(showtimeDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/showtimes")
    public ResponseEntity<?> getAllShowtimes(@RequestParam int page,
                                         @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("showtimeId").ascending());
        Page<ShowtimeDTO> showtimes = showtimeService.findShowtimes(pageable);
        return ResponseEntity.ok(showtimes);
    }

    @PostMapping("/showtimes")
    public ResponseEntity<?> createShowtime(@RequestBody ShowtimeDTO showtimeDTO){
        try {
            ShowtimeDTO createdshowtime = showtimeService.addShowtime(showtimeDTO);
            System.out.println("Received showtimeDTO: " + createdshowtime);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdshowtime);
        } catch (IllegalArgumentException e) {
            // Loi validate (username da ton tai)
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Loi khong xac dinh
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo lịch chiếu.");
        }
    }

    @PutMapping("showtimes/{id}")
    public ResponseEntity<?> updateshowtime(@PathVariable Long id, @RequestBody ShowtimeDTO showtimeDTO) {
        Optional<ShowtimeResponseDTO> updated = showtimeService.updateShowtime(id, showtimeDTO);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            return ResponseEntity.status(404).body("lịch chiếu không tồn tại");
        }
    }

//    @DeleteMapping("showtimes/{id}")
//    public ResponseEntity<String> deleteshowtime(@PathVariable Long id) {
//        boolean deleted = showtimeService.deleteShowtime(id);
//        if (deleted) {
//            return ResponseEntity.ok("Xóa lịch chiếu thành công");
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy lịch chiếu để xóa");
//        }
//    }
}
