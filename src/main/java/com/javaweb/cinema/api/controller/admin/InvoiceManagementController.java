package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.api.dto.InvoiceDetailResponseDTO;
import com.javaweb.cinema.api.dto.InvoiceResponseDTO;
import com.javaweb.cinema.service.InvoiceService;
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
public class InvoiceManagementController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/invoices/{id}")
    public ResponseEntity<?> searchInvoiceById(@PathVariable Long id) {
        Optional<InvoiceDetailResponseDTO> invoiceOptional = invoiceService.findInvoiceById(id);

        if (invoiceOptional.isPresent()) {
            InvoiceDetailResponseDTO invoiceDTO = invoiceOptional.get();
            return ResponseEntity.ok(invoiceDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy kết quả phù hợp");
        }
    }

    @GetMapping("/invoices")
    public ResponseEntity<?> getAllTicketsSold(@RequestParam int page,
                                               @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("invoiceId").ascending());
        Page<InvoiceResponseDTO> tickets = invoiceService.findInvoices(pageable);
        return ResponseEntity.ok(tickets);
    }
}
