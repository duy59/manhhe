package com.warehouse.security;

import com.warehouse.entity.Employee;
import com.warehouse.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;

/**
 * Service để load user details cho Spring Security
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee employee = employeeRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        if (!employee.getActive()) {
            throw new UsernameNotFoundException("User is inactive: " + username);
        }

        return new User(
                employee.getUsername(),
                employee.getPassword(),
                getAuthorities(employee)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(Employee employee) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + employee.getRole().name()));
    }
}
