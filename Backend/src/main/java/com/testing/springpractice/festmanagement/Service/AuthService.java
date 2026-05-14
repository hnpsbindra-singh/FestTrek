package com.testing.springpractice.festmanagement.Service;

import com.testing.springpractice.festmanagement.DTO.LoginRequest;
import com.testing.springpractice.festmanagement.DTO.ProfileRegister;
import com.testing.springpractice.festmanagement.DTO.RegisterResponse;
import com.testing.springpractice.festmanagement.DTO.ResetPasswordRequest;
import com.testing.springpractice.festmanagement.Repo.UsersRepo;
import com.testing.springpractice.festmanagement.Utils.JwtUtils;
import com.testing.springpractice.festmanagement.models.Role;
import com.testing.springpractice.festmanagement.models.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    UsersRepo repo;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    EmailService emailService;

    public RegisterResponse register(ProfileRegister request) {
        Users user = new Users();
        user.setName(request.getName());
        user.setRole(request.getRole());
        user.setMobile(request.getMobile());
        user.setUsername(request.getUsername());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setVerified(false);
        if(request.getRole().equals(Role.ORGANISER)){
            user.setAccountHolderName(request.getAccountHolderName());
            user.setBankAccountNumber(request.getBankAccountNumber());
            user.setIfscCode(request.getIfscCode());
            user.setUpiId(request.getUpiId());
        }
        Users us = repo.save(user);

        return maptores(us);
    }
    private RegisterResponse maptores(Users us) {
        RegisterResponse response = new RegisterResponse();
        response.setName(us.getName());
        response.setId(us.getId());
        response.setMobile(us.getMobile());
        response.setRole(us.getRole());
        response.setUsername(us.getUsername());
        return response;
    }


    public String login(LoginRequest request) {
        try{
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken
                    (request.getUsername(),
                    request.getPassword()));
        }catch (Exception e){
            e.printStackTrace();
            return "Invalid Credentials";
        }
        Users user = repo.findByUsername(request.getUsername());

        if(user==null){
            return "User Not Found";
        }
        if(!user.getVerified()){
            return "verify First";
        }
        return jwtUtils.generateToken(user.getUsername(), user.getRole());

    }

    public void sendotp(String username) {
        String otp = String.
                valueOf(100000 + new java.
                        security.
                        SecureRandom().
                        nextInt(900000));
        Long otpExpiryAt = System.currentTimeMillis() + (5 * 60 * 1000);


        Users user = repo.findByUsername(username);
        if(user==null){
            throw new RuntimeException("User not found");
        }
        user.setOtp(otp);
        user.setOtpExpiryAt(otpExpiryAt);

        repo.save(user);

        emailService.sendotp(username, otp);

    }

    public void forgot(ResetPasswordRequest request) {

        Users user = repo.findByUsername(request.getUsername());
        if(user == null){
            throw new RuntimeException("user not found");
        }
        if(user.getOtp()==null||!user.getOtp().equals(request.getOtp())){
            throw new RuntimeException("Invalid OTP");
        }
        if(user.getOtpExpiryAt()<System.currentTimeMillis()){
            throw new RuntimeException("OTP expired");
        }
        user.setPassword(encoder.encode(request.getPassword()));
        user.setOtp(null);
        user.setOtpExpiryAt(null);
        repo.save(user);

    }

    public String verifyOtp(String username, String otp) {

        Users user = repo.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (user.getOtp() == null) {
            throw new RuntimeException("OTP not generated");
        }

        if (!user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiryAt() < System.currentTimeMillis()) {
            throw new RuntimeException("OTP expired");
        }

        user.setVerified(true);

        user.setOtp(null);

        user.setOtpExpiryAt(null);

        repo.save(user);

        return "OTP verified successfully";
    }
}
