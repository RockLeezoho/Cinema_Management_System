package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.InvoiceDetailResponseDTO;
import com.javaweb.cinema.api.dto.InvoiceResponseDTO;
import com.javaweb.cinema.persistence.entity.Invoice;
import com.javaweb.cinema.persistence.repository.InvoiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Optional<InvoiceDetailResponseDTO> findInvoiceById(Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            InvoiceDetailResponseDTO dto = modelMapper.map(invoice, InvoiceDetailResponseDTO.class);

            dto.setUser(modelMapper.map(invoice.getUser(), InvoiceDetailResponseDTO.UserViewDTO.class));

            List<InvoiceDetailResponseDTO.ConcessionViewDTO> concessionDtos = invoice.getInvoiceConcessions().stream()
                    .map(ic -> {
                        InvoiceDetailResponseDTO.ConcessionViewDTO cDto = new InvoiceDetailResponseDTO.ConcessionViewDTO();
                        cDto.setName(ic.getConcession().getName());
                        cDto.setType(ic.getConcession().getType());
                        cDto.setSellingPrice(ic.getConcession().getSellingPrice());
                        cDto.setQuantity(ic.getQuantity());
                        return cDto;
                    }).toList();

            dto.setConcessions(concessionDtos);

            return dto;
        });
    }


    public Page<InvoiceResponseDTO> findInvoices(Pageable pageable) {
        Page<Invoice> invoices = invoiceRepository.findAll(pageable);
        return invoices.map(invoice -> {
            InvoiceResponseDTO dto = new InvoiceResponseDTO();
            dto.setInvoiceId(invoice.getInvoiceId());
            dto.setPaymentMethod(invoice.getPaymentMethod());
            dto.setPaymentDate(invoice.getPaymentDate());
            dto.setUsername(invoice.getUser().getUsername());
            dto.setFullName(invoice.getUser().getName());

            double totalAmount = invoice.getInvoiceConcessions()
                    .stream()
                    .mapToDouble(ic -> ic.getQuantity() * ic.getConcession().getSellingPrice())
                    .sum();
            dto.setTotalAmount(totalAmount);
            return dto;
        });
    }
}
