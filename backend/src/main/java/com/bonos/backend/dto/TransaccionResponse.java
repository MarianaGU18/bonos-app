package com.bonos.backend.dto;

import com.bonos.backend.model.TipoTransaccion;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransaccionResponse(
    Long id,
    TipoTransaccion tipo,
    BigDecimal monto,
    String descripcion,
    LocalDateTime createdAt
) {}