package com.javaweb.cinema.api.controller.admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.cinema.api.dto.ConcessionDTO;
import com.javaweb.cinema.api.dto.VoucherDTO;
import com.javaweb.cinema.service.ConcessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Optional;
import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/_adminv1-cinpenut")
public class ConcessionManagementController {

    @Autowired
    private ConcessionService concessionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${upload.path}")
    private String uploadPath;

    @GetMapping("/concessions/{id}")
    public ResponseEntity<?> searchConcessionById(@PathVariable Long id) {
        Optional<ConcessionDTO> concessionOptional = concessionService.findConcessionById(id);

        if (concessionOptional.isPresent()) {
            return ResponseEntity.ok(concessionOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }


    @GetMapping("/concessions")
    public ResponseEntity<?> getAllConcessions(@RequestParam int page,
                                               @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("concessionId").ascending());
        Page<ConcessionDTO> concessions = concessionService.findConcessions(pageable);
        return ResponseEntity.ok(concessions);
    }

    @PostMapping(value = "/concessions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createConcession(
            @RequestParam("concession") String concessionJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            ConcessionDTO concessionDTO = objectMapper.readValue(concessionJson, ConcessionDTO.class);

            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "concessions";
                System.out.println("UploadDir = " + uploadDir);

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                concessionDTO.setImage("/images/concessions/" + uniqueFileName);
            }

            ConcessionDTO createdConcession = concessionService.addConcession(concessionDTO);
            System.out.println("Received concessionDTO: " + createdConcession);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdConcession);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @PutMapping(value = "concessions/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateConcession(
            @PathVariable Long id,
            @RequestParam("concession") String concessionJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            ConcessionDTO concessionDTO = objectMapper.readValue(concessionJson, ConcessionDTO.class);

            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "concessions";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                concessionDTO.setImage("/images/concessions/" + uniqueFileName);
            }
            Optional<ConcessionDTO> updated = concessionService.updateConcession(id, concessionDTO);
            if (updated.isPresent()) {
                return ResponseEntity.ok(updated.get());
            } else {
                return ResponseEntity.status(404).body("Sản phẩm không tồn tại");
            }
        } catch (JsonProcessingException e) {
            System.out.println("Lỗi parse JSON: " + e.getMessage());
            return ResponseEntity.badRequest().body("Dữ liệu sản phẩm không hợp lệ.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi cập nhật sản phẩm.");
        }
    }

}
