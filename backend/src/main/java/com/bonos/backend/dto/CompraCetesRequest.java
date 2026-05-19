package com.bonos.backend.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompraCetesRequest {

    @NotNull(message = "El monto no puede ser nulo")
    @DecimalMin(value = "100.0", inclusive = true, message = "El monto debe ser de al menos 100")
    private BigDecimal monto;

    @NotNull(message = "El plazo no puede ser nulo")
    @Positive(message = "El plazo debe ser un entero positivo")
    private int plazo;
}
