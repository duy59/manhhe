package com.warehouse.controller;

import com.warehouse.dto.response.ApiResponse;
import com.warehouse.dto.response.MaterialWarningDTO;
import com.warehouse.entity.Material;
import com.warehouse.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller cho quản lý Nguyên liệu
 */
@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    /**
     * 5.2 Xem danh sách nguyên liệu tồn kho
     * GET /api/materials
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF', 'KITCHEN_STAFF')")
    public ResponseEntity<ApiResponse<List<Material>>> getAllMaterials() {
        try {
            List<Material> materials = materialService.getAllMaterials();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách nguyên liệu thành công", materials));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi lấy danh sách nguyên liệu: " + e.getMessage()));
        }
    }

    /**
     * Xem chi tiết nguyên liệu
     * GET /api/materials/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF', 'KITCHEN_STAFF')")
    public ResponseEntity<ApiResponse<Material>> getMaterialById(@PathVariable Long id) {
        try {
            Material material = materialService.getMaterialById(id);
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin nguyên liệu thành công", material));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi lấy thông tin nguyên liệu: " + e.getMessage()));
        }
    }

    /**
     * Tìm kiếm nguyên liệu theo tên
     * GET /api/materials/search?name={name}
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF', 'KITCHEN_STAFF')")
    public ResponseEntity<ApiResponse<List<Material>>> searchMaterials(@RequestParam String name) {
        try {
            List<Material> materials = materialService.searchMaterialsByName(name);
            return ResponseEntity.ok(ApiResponse.success("Tìm kiếm thành công", materials));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi tìm kiếm: " + e.getMessage()));
        }
    }

    /**
     * 5.5 Cảnh báo tồn kho thấp / hết hạn
     * GET /api/materials/warning
     */
    @GetMapping("/warning")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_STAFF')")
    public ResponseEntity<ApiResponse<List<MaterialWarningDTO>>> getWarnings() {
        try {
            List<MaterialWarningDTO> warnings = materialService.getWarnings();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách cảnh báo thành công", warnings));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi khi lấy cảnh báo: " + e.getMessage()));
        }
    }
}
