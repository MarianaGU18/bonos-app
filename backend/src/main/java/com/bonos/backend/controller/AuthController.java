package com.bonos.backend.controller;

import com.bonos.backend.dto.LoginRequest;
import com.bonos.backend.dto.LoginResponse;
import com.bonos.backend.model.User;
import com.bonos.backend.repository.UserRepository;
import com.bonos.backend.security.JwtService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(
        origins = "http://localhost:3000", // 🔁 cambiar en producción
        allowCredentials = "true"
)
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
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().trim());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(new LoginResponse(null, null, "Invalid credentials", null, null));
        }

        User user = userOpt.get();

        if (!user.getPassword().trim().equals(request.getPassword().trim())) {
            return ResponseEntity.status(401)
                    .body(new LoginResponse(null, null, "Invalid credentials", null, null));
        }

        String token = jwtService.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false) // ⚠️ EN PRODUCCIÓN = true (HTTPS)
                .path("/")
                .sameSite("Lax")
                .maxAge(60 * 60 * 24)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new LoginResponse(
                        null,
                        null,
                        "LOGIN OK",
                        user.getRole().name(),
                        user.getEmail()
                ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out");
    }
}