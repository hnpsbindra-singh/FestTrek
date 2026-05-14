package com.testing.springpractice.festmanagement.DTO;

import com.testing.springpractice.festmanagement.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {
    private String id;
    private String name;
    private Role role;
    private String username;
    private String mobile;

}
