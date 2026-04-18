package com.bonos.backend.controller;

import com.bonos.backend.dto.LoginResponse;
import com.bonos.backend.model.User;
import com.bonos.backend.repository.UserRepository;
import com.bonos.backend.security.JwtService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
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

        Optional<User> userOpt = userRepository.findByMail(request.getMail());

        if (userOpt.isEmpty()) {
            return new LoginResponse(null, "Invalid credentials", null, null);
        }

        User user = userOpt.get();

        // 🔴 Comparación simple (Opción A)
        if (!user.getPassword().equals(request.getPassword())) {
            return new LoginResponse(null, "Invalid credentials", null, null);
        }

        String token = jwtService.generateToken(user.getMail());

        return new LoginResponse(
                token,
                "LOGIN OK",
                user.getMail(),
                user.getRole().name()
        );
    }
}