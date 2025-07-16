package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.TicketTypeDTO;
import com.javaweb.cinema.api.dto.TicketTypeResponseDTO;
import com.javaweb.cinema.persistence.entity.TicketType;
import com.javaweb.cinema.persistence.entity.Voucher;
import com.javaweb.cinema.persistence.repository.MapperRepository;
import com.javaweb.cinema.persistence.repository.TicketTypeRepository;
import com.javaweb.cinema.persistence.repository.VoucherRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketTypeService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @Autowired
    private MapperRepository mapperRepository;

    @Autowired
    private ModelMapper modelMapper;

    public TicketTypeDTO addTicketType(TicketTypeDTO ticketTypeDTO) {
        TicketType ticketType;

        if (ticketTypeDTO.getTicketTypeId() != null) {
            ticketType = ticketTypeRepository.findById(ticketTypeDTO.getTicketTypeId())
                    .orElse(new TicketType());

            ticketType.setName(ticketTypeDTO.getName());
            ticketType.setPrice(ticketTypeDTO.getPrice());

            if (ticketTypeDTO.getVoucherId() != null) {
                Voucher voucher = voucherRepository.findById(ticketTypeDTO.getVoucherId())
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy voucher với ID: " + ticketTypeDTO.getVoucherId()));
                ticketType.setVoucher(voucher);
            } else {
                ticketType.setVoucher(null);
            }
        } else {
            ticketType = mapperRepository.ticketTypeDTOToTicketType(ticketTypeDTO);

            if (ticketTypeDTO.getVoucherId() != null) {
                Voucher voucher = voucherRepository.findById(ticketTypeDTO.getVoucherId())
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy voucher với ID: " + ticketTypeDTO.getVoucherId()));
                ticketType.setVoucher(voucher);
            } else {

                ticketType.setVoucher(null);
            }
        }

        ticketType = ticketTypeRepository.save(ticketType);
        return mapperRepository.ticketTypeToTicketTypeDTO(ticketType);
    }

    public Optional<TicketTypeResponseDTO> updateTicketType(Long id, TicketTypeDTO ticketTypeDTO) {
        return ticketTypeRepository.findById(id).map(ticketType -> {
            ticketType.setName(ticketTypeDTO.getName());
            ticketType.setPrice(ticketTypeDTO.getPrice());

            if (ticketTypeDTO.getVoucherId() != null) {
                Voucher voucher = voucherRepository.findById(ticketTypeDTO.getVoucherId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mại với ID: " + ticketTypeDTO.getVoucherId()));
                ticketType.setVoucher(voucher);
            } else {

                ticketType.setVoucher(null);
            }

            TicketType updatedTicketType = ticketTypeRepository.save(ticketType);

            return new TicketTypeResponseDTO(updatedTicketType);
        });
    }


    public Optional<TicketTypeDTO> findTicketTypeById(Long id) {
        return ticketTypeRepository.findById(id)
                .map(mapperRepository::ticketTypeToTicketTypeDTO);
    }

    public Page<TicketTypeDTO> findTicketTypes(Pageable pageable) {
        Page<TicketType> ticketTypes = ticketTypeRepository.findAll(pageable);
        return ticketTypes.map(mapperRepository::ticketTypeToTicketTypeDTO);
    }

    public List<TicketTypeDTO> getAllTicketTypes() {
        List<TicketType> ticketTypes = ticketTypeRepository.findAll();

        return ticketTypes.stream()
                .map(ticketType -> modelMapper.map(ticketType, TicketTypeDTO.class))
                .collect(Collectors.toList());
    }
}


