package com.bonos.backend.controller;

import com.bonos.backend.dto.LoginResponse;
import com.bonos.backend.model.User;
import com.bonos.backend.repository.UserRepository;
import com.bonos.backend.security.JwtService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        // 🔥 DEBUG FRONT
        System.out.println("MAIL FRONT: '" + request.getMail() + "'");
        System.out.println("PASS FRONT: '" + request.getPassword() + "'");

        Optional<User> userOpt = userRepository.findByMail(request.getMail().trim());

        if (userOpt.isEmpty()) {
            System.out.println("USER NOT FOUND");
            return new LoginResponse(null, null, "Invalid credentials", null, null);
        }

        User user = userOpt.get();

        // 🔥 DEBUG DB
        System.out.println("MAIL DB: '" + user.getMail() + "'");
        System.out.println("PASS DB: '" + user.getPassword() + "'");

        if (!user.getPassword().trim().equals(request.getPassword().trim())) {
            System.out.println("PASSWORD NOT MATCH");
            return new LoginResponse(null, null, "Invalid credentials", null, null);
        }

        System.out.println("LOGIN OK");

        String token = jwtService.generateToken(user.getMail());

        return new LoginResponse(
                token,
                null,
                "LOGIN OK",
                user.getRole().name(),
                user.getMail()
        );
    }
}