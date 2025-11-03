package com.warehouse.service;

import com.warehouse.dto.request.LoginRequest;
import com.warehouse.dto.response.LoginResponse;
import com.warehouse.entity.Employee;
import com.warehouse.repository.EmployeeRepository;
import com.warehouse.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Service cho xác thực (Authentication)
 */
@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Đăng nhập
     */
    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        Employee employee = employeeRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new LoginResponse(
                jwt,
                employee.getId(),
                employee.getUsername(),
                employee.getFullName(),
                employee.getEmail(),
                employee.getRole().name()
        );
    }

    /**
     * Đăng xuất
     */
    public void logout() {
        SecurityContextHolder.clearContext();
    }
}
