package com.ems.repository;

import com.ems.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmpId(String empId);
    boolean existsByEmpId(String empId);
    void deleteByEmpId(String empId);
}
