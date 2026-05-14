package com.testing.springpractice.festmanagement.Controllers;

import com.testing.springpractice.festmanagement.DTO.LoginRequest;
import com.testing.springpractice.festmanagement.DTO.ProfileRegister;
import com.testing.springpractice.festmanagement.DTO.RegisterResponse;
import com.testing.springpractice.festmanagement.DTO.ResetPasswordRequest;
import com.testing.springpractice.festmanagement.Service.AuthService;
import com.testing.springpractice.festmanagement.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService service;

    @Autowired
    EmailService emailService;

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody ProfileRegister request){
        RegisterResponse response = service.register(request);
        emailService.SendWelcome(response.getUsername(), request.getName());
        return response;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request){
        return service.login(request);
    }

    @PostMapping("/send-otp")
    public void sendotp(@RequestParam String username){
         service.sendotp(username);

    }

    @PostMapping("/verify-otp")
    public String verifyOtp(
            @RequestParam String username,
            @RequestParam String otp
    ) {

        return service.verifyOtp(username, otp);
    }

    @PostMapping("/forgot-password-otp")
    public void forgotpass(@RequestParam String username){
         try {
             service.sendotp(username);
         } catch (Exception e) {
             e.printStackTrace();
             throw new RuntimeException(e);
         }
    }

    @PostMapping("/reset-password")
    public void forgotpass(@RequestBody ResetPasswordRequest request){
        try {
            service.forgot(request);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }




}
