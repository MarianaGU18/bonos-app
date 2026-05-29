package com.bonos.backend.repository;

import com.bonos.backend.model.Bono;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BonoRepository extends JpaRepository<Bono, Long> {
    List<Bono> findByPortafolioId(Long portafolioId);
}
