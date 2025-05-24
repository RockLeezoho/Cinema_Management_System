package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.ConcessionDTO;
import com.javaweb.cinema.api.dto.VoucherDTO;
import com.javaweb.cinema.persistence.entity.*;
import com.javaweb.cinema.persistence.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConcessionService {


    @Autowired
    private MapperRepository mapperRepository;

    @Autowired
    private ConcessionRepository concessionRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private CinemaRepository cinemaRepository;

    @Autowired
    private AvailableConcessionRepository availableConcessionRepository;

    public Optional<ConcessionDTO> findConcessionById(Long id) {
        return concessionRepository.findById(id)
                .map(concession -> {
                    ConcessionDTO dto = mapperRepository.concessionToDTO(concession);

                    List<Long> cinemaIds = availableConcessionRepository
                            .findByConcession(concession)
                            .stream()
                            .map(ac -> ac.getCinema().getCinemaId())
                            .collect(Collectors.toList());

                    dto.setCinemaIds(cinemaIds);

                    return dto;
                });
    }

    public Page<ConcessionDTO> findConcessions(Pageable pageable) {
        Page<Concession> concessions = concessionRepository.findAll(pageable);

        return concessions.map(concession -> {
            ConcessionDTO dto = mapperRepository.concessionToDTO(concession);

            if (dto.getId() == null) {
                dto.setId(concession.getConcessionId());
            }

            List<Long> cinemaIds = availableConcessionRepository
                    .findByConcession(concession)
                    .stream()
                    .map(ac -> ac.getCinema().getCinemaId())
                    .collect(Collectors.toList());

            dto.setCinemaIds(cinemaIds);

            return dto;
        });
    }




    public ConcessionDTO addConcession(ConcessionDTO dto) {
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà cung cấp"));

        List<Concession> existingList = concessionRepository.findByNameAndTypeAndSupplier(
                dto.getName(), dto.getType(), supplier);

        if (!existingList.isEmpty()) {
            throw new IllegalArgumentException("Mặt hàng đã tồn tại với tên, loại và nhà cung cấp này.");
        }

        Concession concession = new Concession();
        concession.setImage(dto.getImage());
        concession.setName(dto.getName());
        concession.setType(dto.getType());
        concession.setImportPrice(dto.getImportPrice());
        concession.setSellingPrice(dto.getSellingPrice());
        concession.setQuantity(dto.getQuantity());
        concession.setSupplier(supplier);

        if (dto.getVoucherId() != null) {
            Voucher voucher = voucherRepository.findById(dto.getVoucherId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy voucher"));
            concession.setVoucher(voucher);
        } else {
            concession.setVoucher(null);
        }

        Concession saved = concessionRepository.save(concession);

        if (dto.getCinemaIds() != null && !dto.getCinemaIds().isEmpty()) {
            for (Long cinemaId : dto.getCinemaIds()) {
                Cinema cinema = cinemaRepository.findById(cinemaId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp có ID: " + cinemaId));

                AvailableConcessionId acId = new AvailableConcessionId(cinemaId, saved.getConcessionId());

                AvailableConcession available = new AvailableConcession();
                available.setId(acId);
                available.setCinema(cinema);
                available.setConcession(saved);

                availableConcessionRepository.save(available);
            }
        }

        return mapperRepository.concessionToDTO(saved);
    }


    @Transactional
    public Optional<ConcessionDTO> updateConcession(Long id, ConcessionDTO dto) {
        Optional<Concession> optionalConcession = concessionRepository.findById(id);
        if (optionalConcession.isEmpty()) {
            return Optional.empty();
        }

        Concession concession = optionalConcession.get();

        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà cung cấp"));

        boolean isDuplicate = concessionRepository
                .findByNameAndTypeAndSupplier(dto.getName(), dto.getType(), supplier)
                .stream()
                .anyMatch(c -> !c.getConcessionId().equals(id)); // khác id hiện tại → trùng người khác

        if (isDuplicate) {
            throw new IllegalArgumentException("Đã tồn tại mặt hàng khác với cùng tên, loại và nhà cung cấp.");
        }

        concession.setImage(dto.getImage());
        concession.setName(dto.getName());
        concession.setType(dto.getType());
        concession.setImportPrice(dto.getImportPrice());
        concession.setSellingPrice(dto.getSellingPrice());
        concession.setQuantity(dto.getQuantity());
        concession.setSupplier(supplier);

        if (dto.getVoucherId() != null) {
            Voucher voucher = voucherRepository.findById(dto.getVoucherId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy voucher"));
            concession.setVoucher(voucher);
        } else {
            concession.setVoucher(null);
        }

        Concession saved = concessionRepository.save(concession);

        availableConcessionRepository.deleteByConcession(saved);

        if (dto.getCinemaIds() != null && !dto.getCinemaIds().isEmpty()) {
            for (Long cinemaId : dto.getCinemaIds()) {
                Cinema cinema = cinemaRepository.findById(cinemaId)
                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy rạp có ID: " + cinemaId));

                AvailableConcessionId acId = new AvailableConcessionId(cinemaId, saved.getConcessionId());

                AvailableConcession available = new AvailableConcession();
                available.setId(acId);
                available.setCinema(cinema);
                available.setConcession(saved);

                availableConcessionRepository.save(available);
            }
        }

        return Optional.of(mapperRepository.concessionToDTO(saved));
    }

    public List<ConcessionDTO> getAvailableConcessions(Long cinemaId) {
        return availableConcessionRepository.findAvailableConcessionsByCinemaId(cinemaId);
    }
}
