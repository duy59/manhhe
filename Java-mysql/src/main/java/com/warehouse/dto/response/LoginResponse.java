package com.warehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho phản hồi đăng nhập
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String role;

    public LoginResponse(String token, Long id, String username, String fullName, String email, String role) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }
}
