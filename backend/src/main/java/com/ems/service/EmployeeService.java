package com.ems.service;

import com.ems.model.Employee;
import com.ems.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepository repo;

    public EmployeeService(EmployeeRepository repo) {
        this.repo = repo;
    }

    public List<Employee> all() {
        return repo.findAll();
    }

    public Employee create(Employee e) {
        if (repo.existsByEmpId(e.getEmpId())) {
            throw new RuntimeException("Employee ID already exists: " + e.getEmpId());
        }
        return repo.save(e);
    }

    public Employee update(String empId, Employee updated) {
        Employee e = repo.findByEmpId(empId).orElseThrow(() -> new RuntimeException("Not found: " + empId));
        e.setName(updated.getName());
        e.setEmail(updated.getEmail());
        e.setPhone(updated.getPhone());
        e.setDepartment(updated.getDepartment());
        e.setRole(updated.getRole());
        e.setSalary(updated.getSalary());
        e.setDoj(updated.getDoj());
        e.setStatus(updated.getStatus());
        return repo.save(e);
    }

    @Transactional
    public void delete(String empId) {
        repo.deleteByEmpId(empId);
    }
}
