package com.warehouse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity cho Yêu cầu bổ sung nguyên liệu
 */
@Entity
@Table(name = "material_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String requestCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(nullable = false)
    private BigDecimal requestedQuantity;

    @Column(nullable = false)
    private String unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Employee requester; // Người yêu cầu (nhân viên bếp)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Employee approver; // Người phê duyệt (nhân viên kho)

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String note;

    private LocalDateTime approvedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = RequestStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum RequestStatus {
        PENDING,    // Chờ xử lý
        APPROVED,   // Đã phê duyệt
        REJECTED,   // Từ chối
        COMPLETED   // Đã hoàn thành
    }
}
