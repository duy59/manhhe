package com.warehouse.service;

import com.warehouse.dto.request.ExportRequest;
import com.warehouse.dto.request.ImportRequest;
import com.warehouse.entity.Employee;
import com.warehouse.entity.Material;
import com.warehouse.entity.MaterialRequest;
import com.warehouse.entity.Transaction;
import com.warehouse.repository.EmployeeRepository;
import com.warehouse.repository.MaterialRepository;
import com.warehouse.repository.MaterialRequestRepository;
import com.warehouse.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service cho quản lý giao dịch nhập - xuất kho
 */
@Service
@Transactional
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private MaterialRequestRepository materialRequestRepository;

    @Autowired
    private MaterialService materialService;

    /**
     * Nhập kho
     */
    public Transaction importMaterial(ImportRequest request) {
        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu"));

        // Cập nhật số lượng
        material.setQuantity(material.getQuantity().add(request.getQuantity()));
        
        // Cập nhật đơn giá nếu có
        if (request.getUnitPrice() != null) {
            material.setUnitPrice(request.getUnitPrice());
        }
        
        // Cập nhật hạn sử dụng nếu có
        if (request.getExpiryDate() != null) {
            material.setExpiryDate(request.getExpiryDate());
        }

        materialRepository.save(material);
        materialService.updateMaterialStatus(material);

        // Tạo transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionCode(generateTransactionCode("IMP"));
        transaction.setMaterial(material);
        transaction.setType(Transaction.TransactionType.IMPORT);
        transaction.setQuantity(request.getQuantity());
        transaction.setUnit(request.getUnit());
        transaction.setUnitPrice(request.getUnitPrice());
        transaction.setTotalPrice(request.getUnitPrice().multiply(request.getQuantity()));
        
        if (request.getSupplierId() != null) {
            transaction.setSupplier(materialRepository.findById(request.getSupplierId())
                    .map(Material::getSupplier)
                    .orElse(null));
        }
        
        transaction.setEmployee(getCurrentEmployee());
        transaction.setNote(request.getNote());
        transaction.setTransactionDate(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    /**
     * Xuất kho
     */
    public Transaction exportMaterial(ExportRequest request) {
        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu"));

        // Kiểm tra số lượng
        if (material.getQuantity().compareTo(request.getQuantity()) < 0) {
            throw new RuntimeException("Không đủ số lượng để xuất. Tồn kho: " + material.getQuantity() + " " + material.getUnit());
        }

        // Cập nhật số lượng
        material.setQuantity(material.getQuantity().subtract(request.getQuantity()));
        materialRepository.save(material);
        materialService.updateMaterialStatus(material);

        // Tạo transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionCode(generateTransactionCode("EXP"));
        transaction.setMaterial(material);
        transaction.setType(Transaction.TransactionType.EXPORT);
        transaction.setQuantity(request.getQuantity());
        transaction.setUnit(material.getUnit());
        transaction.setUnitPrice(material.getUnitPrice());
        
        if (material.getUnitPrice() != null) {
            transaction.setTotalPrice(material.getUnitPrice().multiply(request.getQuantity()));
        }
        
        transaction.setEmployee(getCurrentEmployee());
        transaction.setNote(request.getNote());
        transaction.setTransactionDate(LocalDateTime.now());

        // Liên kết với yêu cầu nếu có
        if (request.getRequestId() != null) {
            MaterialRequest materialRequest = materialRequestRepository.findById(request.getRequestId())
                    .orElse(null);
            transaction.setRequest(materialRequest);
            
            // Cập nhật trạng thái yêu cầu
            if (materialRequest != null) {
                materialRequest.setStatus(MaterialRequest.RequestStatus.COMPLETED);
                materialRequestRepository.save(materialRequest);
            }
        }

        return transactionRepository.save(transaction);
    }

    /**
     * Lấy lịch sử giao dịch
     */
    public List<Transaction> getTransactionHistory(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null) {
            return transactionRepository.findByTransactionDateBetween(startDate, endDate);
        }
        return transactionRepository.findAll();
    }

    /**
     * Lấy lịch sử giao dịch theo nguyên liệu
     */
    public List<Transaction> getTransactionHistoryByMaterial(Long materialId) {
        return transactionRepository.findTransactionHistoryByMaterial(materialId);
    }

    /**
     * Sinh mã giao dịch tự động
     */
    private String generateTransactionCode(String prefix) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return prefix + "-" + timestamp;
    }

    /**
     * Lấy thông tin nhân viên hiện tại
     */
    private Employee getCurrentEmployee() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return employeeRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin nhân viên"));
    }
}
