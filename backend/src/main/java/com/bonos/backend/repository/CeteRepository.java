package com.bonos.backend.repository;

import com.bonos.backend.model.Cete;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CeteRepository extends JpaRepository<Cete, Long> {
    List<Cete> findByPortafolioId(Long portafolioId);
}