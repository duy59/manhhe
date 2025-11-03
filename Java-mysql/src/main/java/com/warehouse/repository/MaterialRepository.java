package com.warehouse.repository;

import com.warehouse.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository cho Material
 */
@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    
    Optional<Material> findByCode(String code);
    
    Boolean existsByCode(String code);
    
    List<Material> findByNameContainingIgnoreCase(String name);
    
    // Tìm nguyên liệu có số lượng thấp hơn ngưỡng tối thiểu
    @Query("SELECT m FROM Material m WHERE m.quantity <= m.minQuantity")
    List<Material> findLowStockMaterials();
    
    // Tìm nguyên liệu sắp hết hạn (trong vòng N ngày)
    @Query("SELECT m FROM Material m WHERE m.expiryDate IS NOT NULL AND m.expiryDate <= :date")
    List<Material> findExpiringSoonMaterials(LocalDate date);
    
    // Tìm nguyên liệu đã hết hạn
    @Query("SELECT m FROM Material m WHERE m.expiryDate IS NOT NULL AND m.expiryDate < CURRENT_DATE")
    List<Material> findExpiredMaterials();
    
    List<Material> findByStatus(Material.Status status);
}
