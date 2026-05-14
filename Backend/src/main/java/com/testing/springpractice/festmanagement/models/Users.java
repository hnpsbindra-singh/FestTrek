package com.testing.springpractice.festmanagement.models;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Document(collection = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users implements UserDetails {
    @Id
    private String id;
    private Role role;
    private String name;
    @Indexed(unique = true)
    private String username;
    private String password;
    private String mobile;

    private String otp;
    private Long otpExpiryAt;

    private Boolean verified;

    private String upiId;

    private String bankAccountNumber;

    private String ifscCode;

    private String accountHolderName;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return verified;
    }
}
