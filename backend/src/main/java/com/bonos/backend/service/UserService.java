package com.bonos.backend.service;

import com.bonos.backend.dto.UpdateUserRequest;
import com.bonos.backend.model.User;
import com.bonos.backend.model.Role;
import com.bonos.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PortafolioService portafolioService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registra un nuevo usuario y le asigna automáticamente un portafolio.
     * Todo ocurre dentro de una sola transacción.
     */
    @Transactional
    public User registrarUsuario(User user) {
        // Verificar si el email ya existe
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email address already registered");
        }

        // Asignar rol por defecto si no tiene uno
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }

        // Encriptar la contraseña antes de persistir
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 1. Guardar el usuario primero
        User savedUser = userRepository.save(user);
        
        // 2. Crear su portafolio asociado
        portafolioService.crearPortafolio(savedUser);
        
        return savedUser;
    }

    public User updateUser(Long id, UpdateUserRequest request) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setName(request.getName());
            user.setLastname(request.getLastname());
            user.setMaternallast(request.getMaternallast());
            user.setBirthdate(request.getBirthdate());
            return userRepository.save(user);
        } else {
            return null;
        }
    }

    /**
     * Verifica las credenciales de un usuario.
     * Compara la contraseña en texto plano con la encriptada en la BD.
     */
    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        return user;
    }
}
