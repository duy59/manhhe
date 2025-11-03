package com.warehouse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity cho Giao dịch nhập - xuất kho
 */
@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String transactionCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(nullable = false)
    private String unit;

    private BigDecimal unitPrice;

    private BigDecimal totalPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Supplier supplier; // Cho giao dịch nhập

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Employee employee; // Nhân viên thực hiện giao dịch

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private MaterialRequest request; // Yêu cầu xuất kho (nếu có)

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false)
    private LocalDateTime transactionDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (transactionDate == null) {
            transactionDate = LocalDateTime.now();
        }
        if (totalPrice == null && unitPrice != null && quantity != null) {
            totalPrice = unitPrice.multiply(quantity);
        }
    }

    public enum TransactionType {
        IMPORT,  // Nhập kho
        EXPORT   // Xuất kho
    }
}
