package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.VoucherDTO;
import com.javaweb.cinema.persistence.entity.TicketType;
import com.javaweb.cinema.persistence.entity.Voucher;
import com.javaweb.cinema.persistence.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private MapperRepository mapperRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    public Optional<VoucherDTO> findVoucherById(Long id) {
        return voucherRepository.findById(id)
                .map(voucher -> mapperRepository.voucherToVoucherDTO(voucher));
    }

    public Page<VoucherDTO> findVouchers(Pageable pageable) {
        Page<Voucher> vouchers =voucherRepository.findAll(pageable);
        return vouchers.map(mapperRepository::voucherToVoucherDTO);
    }

    public Voucher createVoucher(VoucherDTO voucherDTO) {
       Voucher voucher = new Voucher();

       voucher.setImage(voucherDTO.getImage());
       voucher.setTitle(voucherDTO.getTitle());
       voucher.setCondition(voucherDTO.getCondition());
       voucher.setStartTime(voucherDTO.getStartTime());
       voucher.setEndTime(voucherDTO.getEndTime());


        return voucherRepository.save(voucher);
    }

    public Optional<VoucherDTO> updateVoucher(Long id,VoucherDTO voucherDTO) {
        Optional<Voucher> optionalVoucher = voucherRepository.findById(id);
        if (optionalVoucher.isEmpty()) {
            return Optional.empty();
        }

       Voucher voucher = optionalVoucher.get();

        voucher.setImage(voucherDTO.getImage());
        voucher.setTitle(voucherDTO.getTitle());
        voucher.setCondition(voucherDTO.getCondition());
        voucher.setStartTime(voucherDTO.getStartTime());
        voucher.setEndTime(voucherDTO.getEndTime());

       Voucher saved =voucherRepository.save(voucher);

       VoucherDTO updatedDTO = mapperRepository.voucherToVoucherDTO(saved);
        return Optional.of(updatedDTO);
    }

//    @Transactional
//    public boolean deleteVoucher(Long voucherId) {
//        Optional<Voucher> optionalVoucher = voucherRepository.findById(voucherId);
//        if (optionalVoucher.isEmpty()) {
//            return false;
//        }
//        Voucher voucher = optionalVoucher.get();
//
//        List<TicketType> ticketTypes = ticketTypeRepository.findByVoucher(voucher);
//
//        for (TicketType t : ticketTypes) {
//            t.setVoucher(null);
//        }
//        ticketTypeRepository.saveAll(ticketTypes);
//
//        voucherRepository.delete(voucher);
//
//        return true;
//    }


}
