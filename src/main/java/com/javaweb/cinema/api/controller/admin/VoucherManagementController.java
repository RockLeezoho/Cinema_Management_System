package com.javaweb.cinema.api.controller.admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaweb.cinema.api.dto.CinemaDTO;
import com.javaweb.cinema.api.dto.VoucherDTO;
import com.javaweb.cinema.persistence.entity.Voucher;
import com.javaweb.cinema.service.VoucherService;
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
public class VoucherManagementController {

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${upload.path}")
    private String uploadPath;

    @GetMapping("/vouchers/{id}")
    public ResponseEntity<?> searchVoucherById(@PathVariable Long id) {
        Optional<VoucherDTO>voucherOptional =voucherService.findVoucherById(id);

        if (voucherOptional.isPresent()) {
            return ResponseEntity.ok(voucherOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/vouchers")
    public ResponseEntity<?> getAllCinemas(@RequestParam int page,
                                           @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("voucherId").ascending());
        Page<VoucherDTO>vouchers =voucherService.findVouchers(pageable);
        return ResponseEntity.ok(vouchers);
    }

    @PostMapping(value = "/vouchers", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createVoucher(
            @RequestParam("voucher") String voucherJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            VoucherDTO voucherDTO = objectMapper.readValue(voucherJson, VoucherDTO.class);

            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "vouchers";
                System.out.println("UploadDir = " + uploadDir);

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                voucherDTO.setImage("/images/vouchers/" + uniqueFileName);
            }
           Voucher createdVoucher = voucherService.createVoucher(voucherDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdVoucher);
        } catch (IllegalArgumentException e) {

            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {

            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo khuyến mại.");
        }
    }

    @PutMapping(value = "vouchers/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateVoucher(
            @PathVariable Long id,
            @RequestParam("voucher") String voucherJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            VoucherDTO voucherDTO = objectMapper.readValue(voucherJson, VoucherDTO.class);

            if (imageFile != null && !imageFile.isEmpty()) {

                String uploadDir = System.getProperty("user.dir") + File.separator + uploadPath + File.separator + "vouchers";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                File destFile = new File(uploadDir, uniqueFileName);
                imageFile.transferTo(destFile);

                voucherDTO.setImage("/images/vouchers/" + uniqueFileName);
            }
            Optional<VoucherDTO> updated =voucherService.updateVoucher(id,voucherDTO);
            if (updated.isPresent()) {
                return ResponseEntity.ok(updated.get());
            } else {
                return ResponseEntity.status(404).body("Khuyến mại không tồn tại");
            }
        } catch (JsonProcessingException e) {
            System.out.println("Lỗi parse JSON: " + e.getMessage());
            return ResponseEntity.badRequest().body("Dữ liệu khuyến mãi không hợp lệ.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi cập nhật khuyến mãi.");
        }
    }

//    @DeleteMapping("vouchers/{id}")
//    public ResponseEntity<String> deleteCinema(@PathVariable Long id) {
//        boolean deleted =voucherService.deleteVoucher(id);
//        if (deleted) {
//            return ResponseEntity.ok("Xóa khuyến mại thành công");
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy khuyến mại để xóa");
//        }
//    }

}

