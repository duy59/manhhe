package com.warehouse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity cho Nguyên liệu trong kho
 */
@Entity
@Table(name = "materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(nullable = false)
    private String unit; // kg, lít, cái, hộp, etc.

    @Column(nullable = false)
    private BigDecimal minQuantity; // Ngưỡng cảnh báo tồn kho thấp

    private BigDecimal unitPrice;

    private LocalDate expiryDate; // Hạn sử dụng

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = Status.AVAILABLE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Status {
        AVAILABLE,      // Còn hàng
        LOW_STOCK,      // Sắp hết
        OUT_OF_STOCK,   // Hết hàng
        EXPIRED         // Hết hạn
    }
}
