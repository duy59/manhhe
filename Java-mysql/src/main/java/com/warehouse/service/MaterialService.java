package com.warehouse.service;

import com.warehouse.dto.response.MaterialWarningDTO;
import com.warehouse.entity.Material;
import com.warehouse.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Service cho quản lý nguyên liệu
 */
@Service
@Transactional
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    /**
     * Lấy danh sách tất cả nguyên liệu
     */
    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    /**
     * Lấy nguyên liệu theo ID
     */
    public Material getMaterialById(Long id) {
        return materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu với ID: " + id));
    }

    /**
     * Tìm kiếm nguyên liệu theo tên
     */
    public List<Material> searchMaterialsByName(String name) {
        return materialRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Lấy cảnh báo tồn kho thấp / hết hạn
     */
    public List<MaterialWarningDTO> getWarnings() {
        List<MaterialWarningDTO> warnings = new ArrayList<>();

        // Nguyên liệu tồn kho thấp
        List<Material> lowStockMaterials = materialRepository.findLowStockMaterials();
        for (Material material : lowStockMaterials) {
            MaterialWarningDTO warning = new MaterialWarningDTO();
            warning.setId(material.getId());
            warning.setCode(material.getCode());
            warning.setName(material.getName());
            warning.setQuantity(material.getQuantity());
            warning.setMinQuantity(material.getMinQuantity());
            warning.setUnit(material.getUnit());
            warning.setExpiryDate(material.getExpiryDate());
            warning.setStatus(material.getStatus());
            warning.setWarningType("LOW_STOCK");
            warning.setWarningMessage("Tồn kho thấp! Số lượng hiện tại: " + material.getQuantity() + " " + material.getUnit());
            warnings.add(warning);
        }

        // Nguyên liệu sắp hết hạn (trong vòng 7 ngày)
        LocalDate sevenDaysLater = LocalDate.now().plusDays(7);
        List<Material> expiringSoon = materialRepository.findExpiringSoonMaterials(sevenDaysLater);
        for (Material material : expiringSoon) {
            MaterialWarningDTO warning = new MaterialWarningDTO();
            warning.setId(material.getId());
            warning.setCode(material.getCode());
            warning.setName(material.getName());
            warning.setQuantity(material.getQuantity());
            warning.setMinQuantity(material.getMinQuantity());
            warning.setUnit(material.getUnit());
            warning.setExpiryDate(material.getExpiryDate());
            warning.setStatus(material.getStatus());
            warning.setWarningType("EXPIRING_SOON");
            warning.setWarningMessage("Sắp hết hạn sử dụng! Hạn dùng: " + material.getExpiryDate());
            warnings.add(warning);
        }

        // Nguyên liệu đã hết hạn
        List<Material> expired = materialRepository.findExpiredMaterials();
        for (Material material : expired) {
            MaterialWarningDTO warning = new MaterialWarningDTO();
            warning.setId(material.getId());
            warning.setCode(material.getCode());
            warning.setName(material.getName());
            warning.setQuantity(material.getQuantity());
            warning.setMinQuantity(material.getMinQuantity());
            warning.setUnit(material.getUnit());
            warning.setExpiryDate(material.getExpiryDate());
            warning.setStatus(Material.Status.EXPIRED);
            warning.setWarningType("EXPIRED");
            warning.setWarningMessage("ĐÃ HẾT HẠN! Hạn dùng: " + material.getExpiryDate());
            warnings.add(warning);
        }

        return warnings;
    }

    /**
     * Cập nhật trạng thái nguyên liệu
     */
    public void updateMaterialStatus(Material material) {
        // Kiểm tra hết hạn
        if (material.getExpiryDate() != null && material.getExpiryDate().isBefore(LocalDate.now())) {
            material.setStatus(Material.Status.EXPIRED);
        }
        // Kiểm tra hết hàng
        else if (material.getQuantity().compareTo(material.getMinQuantity()) <= 0) {
            if (material.getQuantity().signum() == 0) {
                material.setStatus(Material.Status.OUT_OF_STOCK);
            } else {
                material.setStatus(Material.Status.LOW_STOCK);
            }
        }
        // Còn hàng
        else {
            material.setStatus(Material.Status.AVAILABLE);
        }
        materialRepository.save(material);
    }
}
