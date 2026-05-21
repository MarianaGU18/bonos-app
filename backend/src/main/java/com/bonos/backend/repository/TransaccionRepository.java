package com.bonos.backend.repository;

import com.bonos.backend.model.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio para la gestión de persistencia de la entidad Transaccion.
 */
@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {

    /**
     * Recupera el historial de transacciones de un usuario específico ordenado por fecha de creación.
     */
    List<Transaccion> findByUserIdOrderByCreatedAtDesc(Long userId);
}