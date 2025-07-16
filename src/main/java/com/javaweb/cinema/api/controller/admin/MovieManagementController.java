package com.javaweb.cinema.api.controller.admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.javaweb.cinema.api.dto.MovieDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.cinema.api.dto.UserDTO;
import com.javaweb.cinema.persistence.entity.Movie;
import com.javaweb.cinema.service.MovieService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Optional;
import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/_adminv1-cinpenut")
public class MovieManagementController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${upload.path}")
    private String uploadPath;

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

    @PostMapping(value = "/movies", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createMovie(
            @RequestParam("movie") String movieJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            MovieDTO movieDTO = objectMapper.readValue(movieJson, MovieDTO.class);

            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "movies";
                System.out.println("UploadDir = " + uploadDir);

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                movieDTO.setImage("/images/movies/" + uniqueFileName);
            }

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

    @PutMapping(value = "movies/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMovie(
            @PathVariable Long id,
            @RequestParam("movie") String movieJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            MovieDTO movieDTO = objectMapper.readValue(movieJson, MovieDTO.class);

            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "movies";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                movieDTO.setImage("/images/movies/" + uniqueFileName);
            }

            Optional<MovieDTO> updated = movieService.updateUser(id, movieDTO);

            if (updated.isPresent()) {
                return ResponseEntity.ok(updated.get());
            } else {
                return ResponseEntity.status(404).body("Phim không tồn tại");
            }
        } catch (JsonProcessingException e) {
            System.out.println("Lỗi parse JSON: " + e.getMessage());
            return ResponseEntity.badRequest().body("Dữ liệu user không hợp lệ.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi cập nhật người dùng.");
        }
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

