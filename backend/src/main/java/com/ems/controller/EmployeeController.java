package com.ems.controller;

import com.ems.model.Employee;
import com.ems.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Employee> all() {
        return service.all();
    }

    @PostMapping
    public ResponseEntity<Employee> create(@Valid @RequestBody Employee e) {
        return ResponseEntity.ok(service.create(e));
    }

    @PutMapping("/{empId}")
    public ResponseEntity<Employee> update(@PathVariable String empId, @Valid @RequestBody Employee e) {
        return ResponseEntity.ok(service.update(empId, e));
    }

    @DeleteMapping("/{empId}")
    public ResponseEntity<Void> delete(@PathVariable String empId) {
        service.delete(empId);
        return ResponseEntity.noContent().build();
    }
}
