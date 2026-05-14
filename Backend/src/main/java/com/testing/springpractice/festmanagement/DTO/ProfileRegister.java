package com.testing.springpractice.festmanagement.DTO;

import com.testing.springpractice.festmanagement.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRegister {
    private String name;
    private Role role;
    private String username;
    private String password;
    private String mobile;
    private String upiId;

    private String bankAccountNumber;

    private String ifscCode;

    private String accountHolderName;

}
