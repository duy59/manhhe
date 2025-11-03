package com.warehouse.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO cho yêu cầu xuất kho
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExportRequest {

    @NotNull(message = "Material ID không được để trống")
    private Long materialId;

    @NotNull(message = "Số lượng không được để trống")
    @Positive(message = "Số lượng phải lớn hơn 0")
    private BigDecimal quantity;

    private Long requestId; // ID của yêu cầu bổ sung (nếu có)

    private String note;
}
