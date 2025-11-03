package com.warehouse.service;

import com.warehouse.dto.request.MaterialRequestDTO;
import com.warehouse.entity.Employee;
import com.warehouse.entity.Material;
import com.warehouse.entity.MaterialRequest;
import com.warehouse.repository.EmployeeRepository;
import com.warehouse.repository.MaterialRepository;
import com.warehouse.repository.MaterialRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service cho quản lý yêu cầu bổ sung nguyên liệu
 */
@Service
@Transactional
public class MaterialRequestService {

    @Autowired
    private MaterialRequestRepository requestRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * Tạo yêu cầu bổ sung
     */
    public MaterialRequest createRequest(MaterialRequestDTO dto) {
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu"));

        MaterialRequest request = new MaterialRequest();
        request.setRequestCode(generateRequestCode());
        request.setMaterial(material);
        request.setRequestedQuantity(dto.getRequestedQuantity());
        request.setUnit(dto.getUnit());
        request.setRequester(getCurrentEmployee());
        request.setStatus(MaterialRequest.RequestStatus.PENDING);
        request.setReason(dto.getReason());
        request.setNote(dto.getNote());

        return requestRepository.save(request);
    }

    /**
     * Lấy tất cả yêu cầu
     */
    public List<MaterialRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    /**
     * Lấy yêu cầu chờ xử lý
     */
    public List<MaterialRequest> getPendingRequests() {
        return requestRepository.findPendingRequests();
    }

    /**
     * Lấy yêu cầu theo ID
     */
    public MaterialRequest getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu với ID: " + id));
    }

    /**
     * Phê duyệt yêu cầu
     */
    public MaterialRequest approveRequest(Long id) {
        MaterialRequest request = getRequestById(id);
        
        if (request.getStatus() != MaterialRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Yêu cầu đã được xử lý");
        }

        request.setStatus(MaterialRequest.RequestStatus.APPROVED);
        request.setApprover(getCurrentEmployee());
        request.setApprovedAt(LocalDateTime.now());

        return requestRepository.save(request);
    }

    /**
     * Từ chối yêu cầu
     */
    public MaterialRequest rejectRequest(Long id, String reason) {
        MaterialRequest request = getRequestById(id);
        
        if (request.getStatus() != MaterialRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Yêu cầu đã được xử lý");
        }

        request.setStatus(MaterialRequest.RequestStatus.REJECTED);
        request.setApprover(getCurrentEmployee());
        request.setApprovedAt(LocalDateTime.now());
        request.setNote(request.getNote() + "\nLý do từ chối: " + reason);

        return requestRepository.save(request);
    }

    /**
     * Sinh mã yêu cầu tự động
     */
    private String generateRequestCode() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "REQ-" + timestamp;
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
