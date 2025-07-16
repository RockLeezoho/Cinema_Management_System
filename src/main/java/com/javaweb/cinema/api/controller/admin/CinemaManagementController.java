package com.javaweb.cinema.api.controller.admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.cinema.api.dto.MovieDTO;
import com.javaweb.cinema.persistence.entity.Cinema;
import com.javaweb.cinema.service.CinemaService;
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
import com.javaweb.cinema.api.dto.CinemaDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Optional;
import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/_adminv1-cinpenut")
public class CinemaManagementController {

    @Autowired
    private CinemaService cinemaService;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${upload.path}")
    private String uploadPath;

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

    @PostMapping(value = "/cinemas", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createCinema(
            @RequestParam("cinema") String cinemaJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            CinemaDTO cinemaDTO = objectMapper.readValue(cinemaJson, CinemaDTO.class);

            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "cinemas";
                System.out.println("UploadDir = " + uploadDir);

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                cinemaDTO.setImage("/images/cinemas/" + uniqueFileName);
            }

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

    @PutMapping(value = "cinemas/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCinema(
            @PathVariable Long id,
            @RequestParam("cinema") String cinemaJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            CinemaDTO cinemaDTO = objectMapper.readValue(cinemaJson, CinemaDTO.class);

            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "cinemas";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                cinemaDTO.setImage("/images/cinemas/" + uniqueFileName);
            }
            Optional<CinemaDTO> updated = cinemaService.updateCinema(id, cinemaDTO);
            if (updated.isPresent()) {
                return ResponseEntity.ok(updated.get());
            } else {
                return ResponseEntity.status(404).body("Rạp không tồn tại");
            }
        } catch (JsonProcessingException e) {
            System.out.println("Lỗi parse JSON: " + e.getMessage());
            return ResponseEntity.badRequest().body("Dữ liệu rạp không hợp lệ.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi cập nhật rạp.");
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
