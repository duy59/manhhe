package com.warehouse.controller;

import com.warehouse.dto.request.LoginRequest;
import com.warehouse.dto.response.ApiResponse;
import com.warehouse.dto.response.LoginResponse;
import com.warehouse.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller cho Authentication (Đăng nhập / Đăng xuất)
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * 5.1 Đăng nhập
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Đăng nhập thất bại: " + e.getMessage()));
        }
    }

    /**
     * 5.1 Đăng xuất
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        try {
            authService.logout();
            return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Đăng xuất thất bại: " + e.getMessage()));
        }
    }
}
