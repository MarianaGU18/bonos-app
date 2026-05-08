package com.bonos.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.bonos.backend.dto.CetesResponse;

@Service
public class CetesService {

    // =========================
    // CONSTANTES BASE
    // =========================

    private static final BigDecimal CETE_NOMINAL = BigDecimal.valueOf(10);
    private static final BigDecimal DIAS = BigDecimal.valueOf(365);

    private static final BigDecimal ISR_ANUAL = BigDecimal.valueOf(0.90);

    private static final int SCALE = 12;
    private static final int MONEY = 2;

    // =========================
    // BONDDIA CONFIGURABLE
    // =========================

    @Value("${finanzas.bonddia.tasa}")
    private BigDecimal tasaBonddia;

    @Value("${finanzas.bonddia.precio}")
    private BigDecimal precioBonddia;

    // =========================
    // MAIN
    // =========================

    public CetesResponse calcularInversion(double monto, int plazo, double tasa) {

        BigDecimal m = bd(monto);
        BigDecimal t = bd(tasa);

        // =========================
        // CETES
        // =========================

        BigDecimal precioCete = calcularPrecio(t, plazo);

        int titulosCetes = m.divide(precioCete, 0, RoundingMode.DOWN).intValue();

        BigDecimal inversionCetes = precioCete.multiply(bd(titulosCetes));

        BigDecimal remanente = m.subtract(inversionCetes);

        BigDecimal valorFinalCetes = CETE_NOMINAL.multiply(bd(titulosCetes));

        BigDecimal interesCetes = valorFinalCetes.subtract(inversionCetes);

        // =========================
        // BONDDIA
        // =========================

        int titulosBonddia =
                remanente.divide(precioBonddia, 0, RoundingMode.DOWN).intValue();

        BigDecimal inversionBonddia =
                precioBonddia.multiply(bd(titulosBonddia));

        BigDecimal remanenteFinal =
                remanente.subtract(inversionBonddia);

        BigDecimal interesBonddia =
                inversionBonddia
                        .multiply(tasaBonddia.divide(bd(100), SCALE, RoundingMode.HALF_UP))
                        .multiply(bd(plazo))
                        .divide(DIAS, SCALE, RoundingMode.HALF_UP);

        // =========================
        // ISR (AJUSTE MÁS REALISTA)
        // =========================

        BigDecimal baseIsr =
                valorFinalCetes
                        .add(inversionBonddia)
                        .add(interesBonddia);

        BigDecimal isr =
                baseIsr
                        .multiply(ISR_ANUAL.divide(bd(100), SCALE, RoundingMode.HALF_UP))
                        .multiply(bd(plazo))
                        .divide(DIAS, SCALE, RoundingMode.HALF_UP);

        // =========================
        // TOTAL FINAL
        // =========================

        BigDecimal totalFinal =
                baseIsr
                        .subtract(isr)
                        .add(remanenteFinal);

        // =========================
        // RESPONSE
        // =========================

        return new CetesResponse(
                m.setScale(MONEY, RoundingMode.HALF_UP),
                plazo,
                totalFinal.setScale(MONEY, RoundingMode.HALF_UP),

                titulosCetes,
                t.setScale(MONEY, RoundingMode.HALF_UP),
                inversionCetes.setScale(MONEY, RoundingMode.HALF_UP),
                interesCetes.setScale(MONEY, RoundingMode.HALF_UP),

                remanenteFinal.setScale(MONEY, RoundingMode.HALF_UP),

                titulosBonddia,
                tasaBonddia.setScale(MONEY, RoundingMode.HALF_UP),
                inversionBonddia.setScale(MONEY, RoundingMode.HALF_UP),
                interesBonddia.setScale(MONEY, RoundingMode.HALF_UP),

                isr.setScale(MONEY, RoundingMode.HALF_UP)
        );
    }

    // =========================
    // PRECIO CETE
    // =========================

    public BigDecimal calcularPrecio(BigDecimal tasa, int plazo) {

        BigDecimal factor =
                tasa.divide(bd(100), SCALE, RoundingMode.HALF_UP)
                        .multiply(bd(plazo))
                        .divide(DIAS, SCALE, RoundingMode.HALF_UP);

        return CETE_NOMINAL.divide(
                BigDecimal.ONE.add(factor),
                SCALE,
                RoundingMode.HALF_UP
        );
    }

    private BigDecimal bd(double v) {
        return BigDecimal.valueOf(v);
    }
}