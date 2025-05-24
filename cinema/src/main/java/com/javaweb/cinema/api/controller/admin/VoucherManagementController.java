package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.api.dto.MovieDTO;
import com.javaweb.cinema.api.dto.VoucherDTO;
import com.javaweb.cinema.persistence.entity.Cinema;
import com.javaweb.cinema.persistence.entity.Movie;
import com.javaweb.cinema.persistence.entity.Voucher;
import com.javaweb.cinema.service.CinemaService;
import com.javaweb.cinema.service.MovieService;
import com.javaweb.cinema.service.VoucherService;
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
public class VoucherManagementController {

    @Autowired
    private VoucherService voucherService;

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

    @PostMapping("/vouchers")
    public ResponseEntity<?> createVoucher(@RequestBody VoucherDTO voucherDTO){
        try {
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

    @PutMapping("vouchers/{id}")
    public ResponseEntity<?> updateVoucher(@PathVariable Long id, @RequestBody VoucherDTO voucherDTO) {
        Optional<VoucherDTO> updated =voucherService.updateVoucher(id,voucherDTO);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            return ResponseEntity.status(404).body("Khuyến mại không tồn tại");
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

