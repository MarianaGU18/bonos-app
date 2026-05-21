package com.bonos.backend.repository;

import com.bonos.backend.model.Portafolio;
import com.bonos.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PortafolioRepository extends JpaRepository<Portafolio, Long> {
    Optional<Portafolio> findByUserId(Long userId);

    Optional<Portafolio> findByUser(User user);
}