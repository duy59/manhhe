package com.warehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO chuẩn cho API Response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private Boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public ApiResponse(Boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Thành công", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
