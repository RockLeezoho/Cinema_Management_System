package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.api.dto.ConcessionDTO;
import com.javaweb.cinema.service.ConcessionService;
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
public class ConcessionManagementController {

    @Autowired
    private ConcessionService concessionService;

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


    @PostMapping("/concessions")
    public ResponseEntity<?> createConcession(@RequestBody ConcessionDTO concessionDTO) {
        try {
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

    @PutMapping("concessions/{id}")
    public ResponseEntity<?> updateConcession(@PathVariable Long id, @RequestBody ConcessionDTO concessionDTO) {
        Optional<ConcessionDTO> updated = concessionService.updateConcession(id, concessionDTO);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            return ResponseEntity.status(404).body("đồ ăn vặt không tồn tại");
        }
    }

}
