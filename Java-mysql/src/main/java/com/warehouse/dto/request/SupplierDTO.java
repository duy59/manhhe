package com.warehouse.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho yêu cầu tạo/cập nhật nhà cung cấp
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierDTO {

    @NotBlank(message = "Tên nhà cung cấp không được để trống")
    private String name;

    @NotBlank(message = "Người liên hệ không được để trống")
    private String contactPerson;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    private String address;

    private String taxCode;

    private String note;

    private Boolean active;
}
