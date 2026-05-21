package com.bonos.backend.service;

import com.bonos.backend.model.Transaccion;
import com.bonos.backend.model.User;
import com.bonos.backend.model.TipoTransaccion;
import com.bonos.backend.repository.TransaccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransaccionService {

    private final TransaccionRepository transaccionRepository;

    public List<Transaccion> getTransactionsByUserId(Long userId) {
        return transaccionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Transaccion registrarTransaccion(User user, TipoTransaccion tipo, BigDecimal monto, String descripcion) {
        Transaccion transaccion = new Transaccion(user, tipo, monto, descripcion);
        return transaccionRepository.save(transaccion);
    }
}