package com.warehouse.controller;

import com.warehouse.dto.request.MaterialRequestDTO;
import com.warehouse.dto.response.ApiResponse;
import com.warehouse.entity.MaterialRequest;
import com.warehouse.service.MaterialRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller cho quản lý Yêu cầu bổ sung nguyên liệu
 */
@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MaterialRequestController {

    @Autowired
    private MaterialRequestService requestService;

    /**
     * 5.6 Xem danh sách yêu cầu
     * GET /api/requests
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF', 'KITCHEN_STAFF')")
    public ResponseEntity<ApiResponse<List<MaterialRequest>>> getAllRequests() {
        try {
            List<MaterialRequest> requests = requestService.getAllRequests();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách yêu cầu thành công", requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi lấy danh sách yêu cầu: " + e.getMessage()));
        }
    }

    /**
     * Xem yêu cầu chờ xử lý
     * GET /api/requests/pending
     */
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<List<MaterialRequest>>> getPendingRequests() {
        try {
            List<MaterialRequest> requests = requestService.getPendingRequests();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách yêu cầu chờ xử lý thành công", requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi lấy danh sách yêu cầu: " + e.getMessage()));
        }
    }

    /**
     * Xem chi tiết yêu cầu
     * GET /api/requests/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF', 'KITCHEN_STAFF')")
    public ResponseEntity<ApiResponse<MaterialRequest>> getRequestById(@PathVariable Long id) {
        try {
            MaterialRequest request = requestService.getRequestById(id);
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin yêu cầu thành công", request));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi lấy thông tin yêu cầu: " + e.getMessage()));
        }
    }

    /**
     * 5.6 Tạo yêu cầu bổ sung
     * POST /api/requests
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'KITCHEN_STAFF')")
    public ResponseEntity<ApiResponse<MaterialRequest>> createRequest(@Valid @RequestBody MaterialRequestDTO dto) {
        try {
            MaterialRequest request = requestService.createRequest(dto);
            return ResponseEntity.ok(ApiResponse.success("Tạo yêu cầu thành công", request));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi tạo yêu cầu: " + e.getMessage()));
        }
    }

    /**
     * 5.6 Phê duyệt yêu cầu
     * PUT /api/requests/{id}/approve
     */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<MaterialRequest>> approveRequest(@PathVariable Long id) {
        try {
            MaterialRequest request = requestService.approveRequest(id);
            return ResponseEntity.ok(ApiResponse.success("Phê duyệt yêu cầu thành công", request));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi phê duyệt yêu cầu: " + e.getMessage()));
        }
    }

    /**
     * 5.6 Từ chối yêu cầu
     * PUT /api/requests/{id}/reject
     */
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<MaterialRequest>> rejectRequest(
            @PathVariable Long id,
            @RequestParam String reason) {
        try {
            MaterialRequest request = requestService.rejectRequest(id, reason);
            return ResponseEntity.ok(ApiResponse.success("Từ chối yêu cầu thành công", request));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi từ chối yêu cầu: " + e.getMessage()));
        }
    }
}
