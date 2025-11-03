package com.warehouse.service;

import com.warehouse.dto.request.SupplierDTO;
import com.warehouse.entity.Supplier;
import com.warehouse.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service cho quản lý nhà cung cấp
 */
@Service
@Transactional
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    /**
     * Lấy tất cả nhà cung cấp
     */
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    /**
     * Lấy nhà cung cấp theo ID
     */
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà cung cấp với ID: " + id));
    }

    /**
     * Tìm kiếm nhà cung cấp theo tên
     */
    public List<Supplier> searchSuppliersByName(String name) {
        return supplierRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Tạo nhà cung cấp mới
     */
    public Supplier createSupplier(SupplierDTO dto) {
        Supplier supplier = new Supplier();
        supplier.setCode(generateSupplierCode());
        supplier.setName(dto.getName());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setPhone(dto.getPhone());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());
        supplier.setTaxCode(dto.getTaxCode());
        supplier.setNote(dto.getNote());
        supplier.setActive(dto.getActive() != null ? dto.getActive() : true);

        return supplierRepository.save(supplier);
    }

    /**
     * Cập nhật nhà cung cấp
     */
    public Supplier updateSupplier(Long id, SupplierDTO dto) {
        Supplier supplier = getSupplierById(id);
        
        supplier.setName(dto.getName());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setPhone(dto.getPhone());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());
        supplier.setTaxCode(dto.getTaxCode());
        supplier.setNote(dto.getNote());
        
        if (dto.getActive() != null) {
            supplier.setActive(dto.getActive());
        }

        return supplierRepository.save(supplier);
    }

    /**
     * Xóa nhà cung cấp (soft delete)
     */
    public void deleteSupplier(Long id) {
        Supplier supplier = getSupplierById(id);
        supplier.setActive(false);
        supplierRepository.save(supplier);
    }

    /**
     * Sinh mã nhà cung cấp tự động
     */
    private String generateSupplierCode() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = supplierRepository.count() + 1;
        return "SUP-" + timestamp + "-" + String.format("%04d", count);
    }
}
