package com.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO cho yêu cầu nhập kho
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportRequest {

    @NotNull(message = "Material ID không được để trống")
    private Long materialId;

    @NotNull(message = "Số lượng không được để trống")
    @Positive(message = "Số lượng phải lớn hơn 0")
    private BigDecimal quantity;

    @NotBlank(message = "Đơn vị không được để trống")
    private String unit;

    @NotNull(message = "Đơn giá không được để trống")
    @Positive(message = "Đơn giá phải lớn hơn 0")
    private BigDecimal unitPrice;

    private Long supplierId;

    private LocalDate expiryDate;

    private String note;
}
