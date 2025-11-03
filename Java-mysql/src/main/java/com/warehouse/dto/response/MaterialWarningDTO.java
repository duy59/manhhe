package com.warehouse.dto.response;

import com.warehouse.entity.Material;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO cho cảnh báo nguyên liệu
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialWarningDTO {

    private Long id;
    private String code;
    private String name;
    private BigDecimal quantity;
    private BigDecimal minQuantity;
    private String unit;
    private LocalDate expiryDate;
    private Material.Status status;
    private String warningType; // LOW_STOCK, EXPIRING_SOON, EXPIRED
    private String warningMessage;
}
