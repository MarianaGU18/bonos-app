package com.bonos.backend.repository;

import com.bonos.backend.model.Portafolio;
import com.bonos.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortafolioRepository extends JpaRepository<Portafolio, Long> {

    Optional<Portafolio> findByUser(User user);

    Optional<Portafolio> findByUserId(Long userId);
}
