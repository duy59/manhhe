package com.warehouse.controller;

import com.warehouse.dto.request.SupplierDTO;
import com.warehouse.dto.response.ApiResponse;
import com.warehouse.entity.Supplier;
import com.warehouse.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller cho quản lý Nhà cung cấp
 */
@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    /**
     * 5.7 Xem danh sách nhà cung cấp
     * GET /api/suppliers
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<List<Supplier>>> getAllSuppliers() {
        try {
            List<Supplier> suppliers = supplierService.getAllSuppliers();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách nhà cung cấp thành công", suppliers));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi lấy danh sách nhà cung cấp: " + e.getMessage()));
        }
    }

    /**
     * Xem chi tiết nhà cung cấp
     * GET /api/suppliers/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<Supplier>> getSupplierById(@PathVariable Long id) {
        try {
            Supplier supplier = supplierService.getSupplierById(id);
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin nhà cung cấp thành công", supplier));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi lấy thông tin nhà cung cấp: " + e.getMessage()));
        }
    }

    /**
     * Tìm kiếm nhà cung cấp theo tên
     * GET /api/suppliers/search?name={name}
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<List<Supplier>>> searchSuppliers(@RequestParam String name) {
        try {
            List<Supplier> suppliers = supplierService.searchSuppliersByName(name);
            return ResponseEntity.ok(ApiResponse.success("Tìm kiếm thành công", suppliers));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi tìm kiếm: " + e.getMessage()));
        }
    }

    /**
     * 5.7 Thêm nhà cung cấp
     * POST /api/suppliers
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<Supplier>> createSupplier(@Valid @RequestBody SupplierDTO dto) {
        try {
            Supplier supplier = supplierService.createSupplier(dto);
            return ResponseEntity.ok(ApiResponse.success("Tạo nhà cung cấp thành công", supplier));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi tạo nhà cung cấp: " + e.getMessage()));
        }
    }

    /**
     * 5.7 Cập nhật nhà cung cấp
     * PUT /api/suppliers/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<Supplier>> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody SupplierDTO dto) {
        try {
            Supplier supplier = supplierService.updateSupplier(id, dto);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật nhà cung cấp thành công", supplier));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi cập nhật nhà cung cấp: " + e.getMessage()));
        }
    }

    /**
     * 5.7 Xóa nhà cung cấp
     * DELETE /api/suppliers/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<String>> deleteSupplier(@PathVariable Long id) {
        try {
            supplierService.deleteSupplier(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa nhà cung cấp thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi xóa nhà cung cấp: " + e.getMessage()));
        }
    }
}
