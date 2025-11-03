package com.warehouse.repository;

import com.warehouse.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository cho Employee
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByUsername(String username);
    
    Optional<Employee> findByEmail(String email);
    
    Boolean existsByUsername(String username);
    
    Boolean existsByEmail(String email);
}
