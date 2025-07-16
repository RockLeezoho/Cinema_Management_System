package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.api.dto.SupplierDTO;
import com.javaweb.cinema.persistence.entity.Supplier;
import com.javaweb.cinema.service.SupplierService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/_adminv1-cinpenut")
public class SupplierManagementController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping("/suppliers/{id}")
    public ResponseEntity<?> searchSupplierById(@PathVariable Long id) {
        Optional<SupplierDTO> supplierOptional = supplierService.findSupplierById(id);

        if (supplierOptional.isPresent()) {
            return ResponseEntity.ok(supplierOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/suppliers")
    public ResponseEntity<?> getAllSuppliers(@RequestParam int page,
                                           @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("supplierId").ascending());
        Page<SupplierDTO>suppliers = supplierService.findSuppliers(pageable);
        return ResponseEntity.ok(suppliers);
    }

    @PostMapping("/suppliers")
    public ResponseEntity<?> createSupplier(@RequestBody SupplierDTO supplierDTO){
        try {
            Supplier createdSupplier = supplierService.createSupplier(supplierDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSupplier);
        } catch (IllegalArgumentException e) {

            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {

            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo nhà cung cấp.");
        }
    }

    @PutMapping("suppliers/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody SupplierDTO supplierDTO) {
        Optional<SupplierDTO> updated =supplierService.updateSupplier(id,supplierDTO);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            return ResponseEntity.status(404).body("nhà cung cấp không tồn tại");
        }
    }

//    @DeleteMapping("suppliers/{id}")
//    public ResponseEntity<String> deleteSupplier(@PathVariable Long id) {
//        boolean deleted = supplierService.deleteSupplier(id);
//        if (deleted) {
//            return ResponseEntity.ok("Xóa nhà cung cấp thành công");
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy nhà cung cấp để xóa");
//        }
//    }

}

