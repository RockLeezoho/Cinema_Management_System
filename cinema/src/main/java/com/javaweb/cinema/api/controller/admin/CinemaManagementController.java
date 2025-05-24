package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.api.dto.MovieDTO;
import com.javaweb.cinema.persistence.entity.Cinema;
import com.javaweb.cinema.persistence.entity.Movie;
import com.javaweb.cinema.service.CinemaService;
import com.javaweb.cinema.service.MovieService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import com.javaweb.cinema.api.dto.CinemaDTO;

import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/_adminv1-cinpenut")
public class CinemaManagementController {

    @Autowired
    private CinemaService cinemaService;

    @GetMapping("/cinemas/{id}")
    public ResponseEntity<?> searchCinemaById(@PathVariable Long id) {
        Optional<CinemaDTO> cinemaOptional = cinemaService.findCinemaById(id);

        if (cinemaOptional.isPresent()) {
            return ResponseEntity.ok(cinemaOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/cinemas")
    public ResponseEntity<?> getAllCinemas(@RequestParam int page,
                                          @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("cinemaId").ascending());
        Page<CinemaDTO> cinemas = cinemaService.findCinemas(pageable);
        return ResponseEntity.ok(cinemas);
    }

    @PostMapping("/cinemas")
    public ResponseEntity<?> createCinema(@RequestBody CinemaDTO cinemaDTO){
        try {
            Cinema createdCinema = cinemaService.createCinema(cinemaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCinema);
        } catch (IllegalArgumentException e) {

            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {

            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo rạp.");
        }
    }

    @PutMapping("cinemas/{id}")
    public ResponseEntity<?> updateCinema(@PathVariable Long id, @RequestBody CinemaDTO cinemaDTO) {
        Optional<CinemaDTO> updated = cinemaService.updateCinema(id, cinemaDTO);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            return ResponseEntity.status(404).body("Rạp không tồn tại");
        }
    }

//    @DeleteMapping("cinemas/{id}")
//    public ResponseEntity<String> deleteCinema(@PathVariable Long id) {
//        boolean deleted = cinemaService.deleteCinema(id);
//        if (deleted) {
//            return ResponseEntity.ok("Xóa rạp thành công");
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy rạp để xóa");
//        }
//    }

}
