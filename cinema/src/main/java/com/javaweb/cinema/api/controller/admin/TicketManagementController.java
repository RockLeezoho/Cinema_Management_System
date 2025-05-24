package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.api.dto.*;
import com.javaweb.cinema.service.TicketService;
import com.javaweb.cinema.service.TicketTypeService;
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
public class TicketManagementController {

    @Autowired
    private TicketTypeService ticketTypeService;

    @Autowired
    private TicketService ticketService;

    @GetMapping("/tickettypes/{id}")
    public ResponseEntity<?> searchTicketTypeById(@PathVariable Long id) {
        Optional<TicketTypeDTO> ticketTypeDTOOptional = ticketTypeService.findTicketTypeById(id);

        if (ticketTypeDTOOptional.isPresent()) {
            TicketTypeDTO ticketTypeDTO = ticketTypeDTOOptional.get();
            System.out.println("ticketTypeDTO: " + ticketTypeDTO);
            return ResponseEntity.ok(ticketTypeDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/tickettypes")
    public ResponseEntity<?> getAllTicketTypes(@RequestParam int page,
                                         @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("ticketTypeId").ascending());
        Page<TicketTypeDTO> ticketTypes = ticketTypeService.findTicketTypes(pageable);
        return ResponseEntity.ok(ticketTypes);
    }

    @PostMapping("/tickettypes")
    public ResponseEntity<?> createTicketType(@RequestBody TicketTypeDTO ticketTypeDTO){
        try {
            TicketTypeDTO createdticketType = ticketTypeService.addTicketType(ticketTypeDTO);
            System.out.println("Received ticketTypeDTO: " + createdticketType);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdticketType);
        } catch (IllegalArgumentException e) {
            // Loi validate (username da ton tai)
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Loi khong xac dinh
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo loại vé.");
        }
    }

    @PutMapping("tickettypes/{id}")
    public ResponseEntity<?> updateTicketType(@PathVariable Long id, @RequestBody TicketTypeDTO ticketTypeDTO) {
        Optional<TicketTypeResponseDTO> updated = ticketTypeService.updateTicketType(id, ticketTypeDTO);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            return ResponseEntity.status(404).body("loại vé không tồn tại");
        }
    }





    @GetMapping("/tickets/{id}")
    public ResponseEntity<?> searchTicketsSoldById(@PathVariable Long id) {
        Optional<TicketDetailResponseDTO> ticketOptional = ticketService.findTicketById(id);

        if (ticketOptional.isPresent()) {
            TicketDetailResponseDTO ticketDTO = ticketOptional.get();
            return ResponseEntity.ok(ticketDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/tickets")
    public ResponseEntity<?> getAllTicketsSold(@RequestParam int page,
                                               @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("ticketId").ascending());
        Page<TicketResponseDTO> tickets = ticketService.findTickets(pageable);
        return ResponseEntity.ok(tickets);
    }

}
