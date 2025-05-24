package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.api.dto.MovieDTO;
import com.javaweb.cinema.persistence.entity.Movie;
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

import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/_adminv1-cinpenut")
public class MovieManagementController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/movies/{id}")
    public ResponseEntity<?> searchMovieById(@PathVariable Long id) {
        Optional<MovieDTO> movieOptional = movieService.findMovieById(id);

        if (movieOptional.isPresent()) {
            return ResponseEntity.ok(movieOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/movies")
    public ResponseEntity<?> getAllMovies(@RequestParam int page,
                                         @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("movieId").ascending());
        Page<MovieDTO> movies = movieService.findMovie(pageable);
        return ResponseEntity.ok(movies);
    }

    @PostMapping("/movies")
    public ResponseEntity<?> createMovie(@RequestBody MovieDTO movieDTO){
        try {
            Movie createdMovie = movieService.createMovie(movieDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMovie);
        } catch (IllegalArgumentException e) {

            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {

            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo phim.");
        }
    }

    @PutMapping("movies/{id}")
    public ResponseEntity<?> updateMovie(@PathVariable Long id, @RequestBody MovieDTO movieDTO) {
        Optional<MovieDTO> updated = movieService.updateUser(id, movieDTO);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            return ResponseEntity.status(404).body("Phim không tồn tại");
        }
    }

//    @DeleteMapping("movies/{id}")
//    public ResponseEntity<String> deleteMovie(@PathVariable Long id) {
//        boolean deleted = movieService.deleteMovie(id);
//        if (deleted) {
//            return ResponseEntity.ok("Xóa phim thành công");
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phim để xóa");
//        }
//    }

}
