package com.warehouse.controller;

import com.warehouse.dto.request.ExportRequest;
import com.warehouse.dto.request.ImportRequest;
import com.warehouse.dto.response.ApiResponse;
import com.warehouse.entity.Transaction;
import com.warehouse.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST Controller cho quản lý Giao dịch nhập - xuất kho
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    /**
     * 5.3 Cập nhật số lượng nhập kho
     * POST /api/materials/import
     */
    @PostMapping("/materials/import")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<Transaction>> importMaterial(@Valid @RequestBody ImportRequest request) {
        try {
            Transaction transaction = transactionService.importMaterial(request);
            return ResponseEntity.ok(ApiResponse.success("Nhập kho thành công", transaction));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi nhập kho: " + e.getMessage()));
        }
    }

    /**
     * 5.4 Cập nhật số lượng xuất kho
     * POST /api/materials/export
     */
    @PostMapping("/materials/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<Transaction>> exportMaterial(@Valid @RequestBody ExportRequest request) {
        try {
            Transaction transaction = transactionService.exportMaterial(request);
            return ResponseEntity.ok(ApiResponse.success("Xuất kho thành công", transaction));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi xuất kho: " + e.getMessage()));
        }
    }

    /**
     * 5.8 Xem lịch sử nhập – xuất kho
     * GET /api/transactions
     */
    @GetMapping("/transactions")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<List<Transaction>>> getTransactionHistory(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<Transaction> transactions = transactionService.getTransactionHistory(startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success("Lấy lịch sử giao dịch thành công", transactions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi lấy lịch sử: " + e.getMessage()));
        }
    }

    /**
     * Xem lịch sử giao dịch theo nguyên liệu
     * GET /api/transactions/material/{materialId}
     */
    @GetMapping("/transactions/material/{materialId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<List<Transaction>>> getTransactionHistoryByMaterial(@PathVariable Long materialId) {
        try {
            List<Transaction> transactions = transactionService.getTransactionHistoryByMaterial(materialId);
            return ResponseEntity.ok(ApiResponse.success("Lấy lịch sử giao dịch thành công", transactions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi lấy lịch sử: " + e.getMessage()));
        }
    }
}
