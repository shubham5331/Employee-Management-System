package com.ems.config;

import com.ems.model.Employee;
import com.ems.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner seed(EmployeeRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(emp("EMP001","shubham Dhone","aarav@acme.com","+91 98765 00001","Engineering","Backend Dev",850000,"2023-07-18","Active"));
                repo.save(emp("EMP002","Priya Singh","priya@acme.com","+91 98765 00002","Engineering","Frontend Dev",780000,"2024-01-10","Active"));
                repo.save(emp("EMP003","Rahul Verma","rahul@acme.com","+91 98765 00003","HR","HR Manager",650000,"2022-03-05","Active"));
                repo.save(emp("EMP004","Neha Patil","neha@acme.com","+91 98765 00004","Finance","Accountant",540000,"2021-11-22","On Leave"));
                repo.save(emp("EMP005","Rohan Mehta","rohan@acme.com","+91 98765 00005","Operations","Ops Exec",480000,"2020-06-01","Active"));
            }
        };
    }

    private Employee emp(String empId,String name,String email,String phone,String dept,String role,int ctc,String doj,String status){
        Employee e = new Employee();
        e.setEmpId(empId);
        e.setName(name);
        e.setEmail(email);
        e.setPhone(phone);
        e.setDepartment(dept);
        e.setRole(role);
        e.setSalary(new BigDecimal(ctc));
        e.setDoj(LocalDate.parse(doj));
        e.setStatus(status);
        return e;
    }
}
