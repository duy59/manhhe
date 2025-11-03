package com.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO cho yêu cầu bổ sung nguyên liệu
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialRequestDTO {

    @NotNull(message = "Material ID không được để trống")
    private Long materialId;

    @NotNull(message = "Số lượng không được để trống")
    @Positive(message = "Số lượng phải lớn hơn 0")
    private BigDecimal requestedQuantity;

    @NotBlank(message = "Đơn vị không được để trống")
    private String unit;

    @NotBlank(message = "Lý do không được để trống")
    private String reason;

    private String note;
}
