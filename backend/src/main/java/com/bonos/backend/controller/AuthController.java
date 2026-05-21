package com.bonos.backend.controller;

import com.bonos.backend.dto.LoginRequest;
import com.bonos.backend.dto.LoginResponse;
import com.bonos.backend.dto.RegisterRequest;
import com.bonos.backend.dto.UpdateUserRequest;
import com.bonos.backend.model.User;
import com.bonos.backend.model.Role;
import com.bonos.backend.repository.UserRepository;
import com.bonos.backend.security.JwtService;
import com.bonos.backend.service.UserService;
import com.bonos.backend.service.PortafolioService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final JwtService jwtService;
    private final PortafolioService portafolioService;

    public AuthController(UserRepository userRepository, 
                          PasswordEncoder passwordEncoder, 
                          UserService userService,
                          JwtService jwtService,
                          PortafolioService portafolioService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.portafolioService = portafolioService;
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        User updatedUser = userService.updateUser(id, request);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail().trim()).isPresent()) {
            return ResponseEntity.status(400)
                    .body(new LoginResponse(null, null, null, null, "Email already exists", null, null));
        }

        User user = new User();
        user.setName(request.getName());
        user.setLastname(request.getLastname()); // <-- CORRECCIÓN
        user.setMaternallast(request.getMaternallast()); // <-- CORRECCIÓN
        user.setBirthdate(request.getBirthdate()); // <-- AÑADIR ESTA LÍNEA
        user.setEmail(request.getEmail().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());

        // Save user and initialize their portfolio
        User savedUser = userRepository.save(user);
        portafolioService.crearPortafolio(savedUser);

        String token = jwtService.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(60 * 60 * 24)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new LoginResponse(
                        user.getId(),
                        user.getName(),
                        user.getLastname(),
                        user.getMaternallast(),
                        "REGISTER OK",
                        user.getRole().name(),
                        user.getEmail()
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().trim());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(new LoginResponse(null, null, null, null, "Invalid credentials", null, null));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(new LoginResponse(null, null, null, null, "Invalid credentials", null, null));
        }

        String token = jwtService.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(60 * 60 * 24)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new LoginResponse(
                        user.getId(),
                        user.getName(),
                        user.getLastname(),
                        user.getMaternallast(),
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
