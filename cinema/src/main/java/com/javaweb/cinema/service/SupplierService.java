package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.SupplierDTO;
import com.javaweb.cinema.persistence.entity.Supplier;
import com.javaweb.cinema.persistence.repository.MapperRepository;
import com.javaweb.cinema.persistence.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private MapperRepository mapperRepository;

    public Optional<SupplierDTO> findSupplierById(Long id) {
        return supplierRepository.findById(id)
                .map(mapperRepository::supplierToSupplierDTO);
    }

    public Page<SupplierDTO> findSuppliers(Pageable pageable) {
        Page<Supplier> suppliers = supplierRepository.findAll(pageable);
        return suppliers.map(mapperRepository::supplierToSupplierDTO);
    }

    public Supplier createSupplier(SupplierDTO supplierDTO) {
        Supplier supplier = new Supplier();

        supplier.setName(supplierDTO.getName());
        supplier.setAddress(supplierDTO.getAddress());
        supplier.setSuppliedItems(supplierDTO.getSuppliedItems());
        supplier.setPhone(supplierDTO.getPhone());
        supplier.setContractStartDate(supplierDTO.getContractStartDate());
        supplier.setContractEndDate(supplierDTO.getContractEndDate());

        return supplierRepository.save(supplier);
    }

    public Optional<SupplierDTO> updateSupplier(Long id, SupplierDTO supplierDTO) {
        Optional<Supplier> optionalSupplier = supplierRepository.findById(id);
        if (optionalSupplier.isEmpty()) {
            return Optional.empty();
        }

        Supplier supplier = optionalSupplier.get();

        supplier.setName(supplierDTO.getName());
        supplier.setAddress(supplierDTO.getAddress());
        supplier.setSuppliedItems(supplierDTO.getSuppliedItems());
        supplier.setPhone(supplierDTO.getPhone());
        supplier.setContractStartDate(supplierDTO.getContractStartDate());
        supplier.setContractEndDate(supplierDTO.getContractEndDate());

        Supplier saved = supplierRepository.save(supplier);
        SupplierDTO updatedDTO = mapperRepository.supplierToSupplierDTO(saved);

        return Optional.of(updatedDTO);
    }

//    @Transactional
//    public boolean deleteSupplier(Long supplierId) {
//        Optional<Supplier> optionalSupplier = supplierRepository.findById(supplierId);
//        if (optionalSupplier.isEmpty()) {
//            return false;
//        }
//
//        supplierRepository.delete(optionalSupplier.get());
//        return true;
//    }
}
