package com.ems.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees", uniqueConstraints = @UniqueConstraint(columnNames = "empId"))
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String empId;

    @NotBlank
    private String name;

    @Email @NotBlank
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String department;

    @NotBlank
    private String role;

    @NotNull
    private BigDecimal salary;

    @NotNull
    private LocalDate doj;

    @NotBlank
    private String status; // Active | On Leave | Resigned


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }

    public LocalDate getDoj() { return doj; }
    public void setDoj(LocalDate doj) { this.doj = doj; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
