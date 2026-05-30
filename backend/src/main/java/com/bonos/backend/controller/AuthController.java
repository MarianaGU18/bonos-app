package com.bonos.backend.controller;

import com.bonos.backend.dto.LoginRequest;
import com.bonos.backend.dto.LoginResponse;
import com.bonos.backend.dto.RegisterRequest;
import com.bonos.backend.dto.UpdateUserRequest;
import com.bonos.backend.model.User;
import com.bonos.backend.security.JwtService;
import com.bonos.backend.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(
        origins = {"http://localhost:3000", "https://bonos-app-mu.vercel.app"},
        allowCredentials = "true"
)
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService,
                          JwtService jwtService) {
        this.jwtService = jwtService;
        this.userService = userService;
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
        User user = new User();
        user.setName(request.getName());
        user.setLastname(request.getLastname());
        user.setMaternallast(request.getMaternallast());
        user.setBirthdate(request.getBirthdate());
        user.setEmail(request.getEmail().trim());
        user.setPassword(request.getPassword());

        // El servicio ahora maneja la verificación de email, encriptación,
        // rol por defecto y creación de portafolio en una sola transacción.
        User savedUser = userService.registrarUsuario(user);

        String token = jwtService.generateToken(savedUser);

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(60 * 60 * 24)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new LoginResponse(
                        savedUser.getId(),
                        savedUser.getName(),
                        savedUser.getLastname(),
                        savedUser.getMaternallast(),
                        "REGISTER OK",
                        savedUser.getRole().name(),
                        savedUser.getEmail(),
                        savedUser.getBirthdate(),
                        token
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Usamos la lógica de validación centralizada en el servicio
        User authenticatedUser = userService.login(request.getEmail().trim(), request.getPassword());
        String token = jwtService.generateToken(authenticatedUser);

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(60 * 60 * 24)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new LoginResponse(
                        authenticatedUser.getId(),
                        authenticatedUser.getName(),
                        authenticatedUser.getLastname(),
                        authenticatedUser.getMaternallast(),
                        "LOGIN OK",
                        authenticatedUser.getRole().name(),
                        authenticatedUser.getEmail(),
                        authenticatedUser.getBirthdate(),
                        token
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
