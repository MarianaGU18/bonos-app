package com.bonos.backend.service;

import com.bonos.backend.dto.UpdateUserRequest;
import com.bonos.backend.model.User;
import com.bonos.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}
