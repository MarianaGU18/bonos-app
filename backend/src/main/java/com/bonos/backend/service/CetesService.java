package com.bonos.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bonos.backend.dto.CetesResponse;
import com.bonos.backend.model.Cete;
import com.bonos.backend.model.Portafolio;
import com.bonos.backend.model.TipoTransaccion;
import com.bonos.backend.model.User;
import com.bonos.backend.repository.CeteRepository;
import com.bonos.backend.dto.CeteSaleEstimateResponse;
import com.bonos.backend.repository.PortafolioRepository;

@Service
public class CetesService {

    // =========================
    // CONSTANTES BASE
    // =========================

    private static final BigDecimal CETE_NOMINAL = BigDecimal.valueOf(10);
    private static final BigDecimal DIAS = BigDecimal.valueOf(360);
    private static final BigDecimal DIAS_AÑO_FISCAL = BigDecimal.valueOf(366);

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

    @Autowired
    private TransaccionService transaccionService;

    @Autowired
    private CeteRepository ceteRepository;

    @Autowired
    private PortafolioRepository portafolioRepository;

    @Autowired
    private BanxicoService banxicoService;

    // Cache para almacenar las tasas actuales (Plazo -> Tasa)
    private final Map<Integer, BigDecimal> currentRates = new ConcurrentHashMap<>();

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
        
        // El ISR se calcula sobre el capital invertido (Cetes + Bonddia)
        BigDecimal baseIsr = inversionCetes.add(inversionBonddia);

        BigDecimal isr =
                baseIsr
                        .multiply(ISR_ANUAL.divide(bd(100), SCALE, RoundingMode.HALF_UP))
                        .multiply(bd(plazo))
                        .divide(DIAS_AÑO_FISCAL, SCALE, RoundingMode.HALF_UP);

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

    /**
     * Tarea programada para actualizar tasas desde Banxico.
     * Se ejecuta cada día a las 9:00 AM.
     */
    @Scheduled(cron = "0 0 9 * * MON-FRI")
    public void updateRatesFromBanxico() {
        try {
            currentRates.put(28, bd(banxicoService.getCetes28dias()));
            currentRates.put(91, bd(banxicoService.getCetes91dias()));
            currentRates.put(182, bd(banxicoService.getCetes182dias()));
            currentRates.put(364, bd(banxicoService.getCetes364dias()));
            System.out.println("Tasas CETES actualizadas exitosamente desde Banxico.");
        } catch (Exception e) {
            System.err.println("Error al actualizar tasas: " + e.getMessage());
        }
    }

    public Map<Integer, BigDecimal> getCurrentRates() {
        // Si el cache está vacío (ej. inicio de app), forzar actualización
        if (currentRates.isEmpty()) {
            updateRatesFromBanxico();
        }
        return currentRates;
    }

    /**
     * Procesa la compra de CETES registrando la transacción.
     */
    @Transactional
    public Portafolio comprarCetes(User user, double monto, int plazo, double tasa) {
        Portafolio portafolio = portafolioRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Portfolio not found for user"));

        // Si la tasa enviada es 0 o nula, usamos la tasa oficial del cache
        BigDecimal tasaFinal = (tasa <= 0 && currentRates.containsKey(plazo)) 
                               ? currentRates.get(plazo) 
                               : bd(tasa);

        BigDecimal totalAmountToCharge = bd(monto);

        if (portafolio.getCashBalance().compareTo(totalAmountToCharge) < 0) {
            throw new RuntimeException("Insufficient funds in available cash");
        }

        // 1. Obtener el desglose de la inversión usando la lógica de cálculo
        CetesResponse calc = calcularInversion(monto, plazo, tasaFinal.doubleValue());

        // 2. Actualizar Balances del Portafolio
        // Se descuenta el monto total invertido del efectivo disponible ($1,000.00)
        portafolio.setCashBalance(portafolio.getCashBalance().subtract(totalAmountToCharge));
        
        // Se suma el valor de los títulos de CETES al balance de CETES
        portafolio.setCetesBalance(portafolio.getCetesBalance().add(calc.getInversionCetes()));
        
        // Se suma la inversión de Bonddia y el remanente líquido al balance de bonos.
        // Esto asegura que el efectivo disponible quede en 0 tras la compra,
        // ya que los centavos sobrantes se consideran parte del fondo Bonddia.
        portafolio.setBondsBalance(portafolio.getBondsBalance().add(calc.getInversionBonddia()).add(calc.getRemanente()));
        
        Portafolio updated = portafolioRepository.save(portafolio);

        // 3. Registrar el Activo (Tenencia de Cetes)
        Cete newCete = new Cete();
        newCete.setPortafolio(portafolio);
        newCete.setPlazo(plazo);
        newCete.setTasaCompra(tasaFinal);
        newCete.setMontoInvertido(calc.getInversionCetes());
        newCete.setFechaVencimiento(LocalDate.now().plusDays(plazo));
        ceteRepository.save(newCete);

        // 4. Registrar Transacción
        String description = String.format("CETES Purchase - %d days (Rate: %.2f%%)", plazo, tasaFinal);
        transaccionService.registrarTransaccion(user, TipoTransaccion.COMPRA, totalAmountToCharge, description);

        return updated;
    }

    /**
     * Estima el monto de venta y la ganancia de un CETE específico si se vendiera hoy.
     * No realiza ninguna modificación en la base de datos.
     */
    public CeteSaleEstimateResponse estimarVentaCetes(Long ceteId) {
        Cete cete = ceteRepository.findById(ceteId)
                .orElseThrow(() -> new RuntimeException("CETE investment not found"));

        // --- LÓGICA DE VALUACIÓN REALISTA ---
        LocalDate fechaCompra = cete.getFechaVencimiento().minusDays(cete.getPlazo());
        long diasTranscurridos = ChronoUnit.DAYS.between(fechaCompra, LocalDate.now());
        
        if (diasTranscurridos < 0) diasTranscurridos = 0; // No se pueden tener días negativos
        
        BigDecimal precioCompra = calcularPrecio(cete.getTasaCompra(), cete.getPlazo());
        BigDecimal titulos = cete.getMontoInvertido().divide(precioCompra, SCALE, RoundingMode.HALF_UP);
        BigDecimal valorAlVencimiento = titulos.multiply(CETE_NOMINAL);
        
        BigDecimal gananciaTotalPosible = valorAlVencimiento.subtract(cete.getMontoInvertido());
        BigDecimal factorTiempo = bd(diasTranscurridos).divide(bd(cete.getPlazo()), SCALE, RoundingMode.HALF_UP);
        BigDecimal gananciaGenerada = gananciaTotalPosible.multiply(factorTiempo);
        
        BigDecimal montoVentaFinal = cete.getMontoInvertido().add(gananciaGenerada);

        return new CeteSaleEstimateResponse(montoVentaFinal.setScale(MONEY, RoundingMode.HALF_UP), gananciaGenerada.setScale(MONEY, RoundingMode.HALF_UP));
    }

    /**
     * Procesa la venta de un CETE específico.
     * Devuelve el capital invertido al balance de efectivo.
     */
    @Transactional
    public Portafolio venderCetes(Long ceteId, boolean includeBonddia) {
        Cete cete = ceteRepository.findById(ceteId)
                .orElseThrow(() -> new RuntimeException("CETE investment not found"));

        Portafolio portafolio = cete.getPortafolio();
        
        // --- LÓGICA DE VALUACIÓN REALISTA ---
        // 1. Calcular cuántos días ha mantenido la inversión
        LocalDate fechaCompra = cete.getFechaVencimiento().minusDays(cete.getPlazo());
        long diasTranscurridos = ChronoUnit.DAYS.between(fechaCompra, LocalDate.now());
        
        // Si se vende el mismo día, los días son 0
        if (diasTranscurridos < 0) diasTranscurridos = 0;
        
        // 2. Calcular el valor final (Nominal de $10 por título)
        // Obtenemos cuántos títulos tiene (Inversión / Precio de compra calculado originalmente)
        BigDecimal precioCompra = calcularPrecio(cete.getTasaCompra(), cete.getPlazo());
        BigDecimal titulos = cete.getMontoInvertido().divide(precioCompra, 8, RoundingMode.HALF_UP);
        BigDecimal valorAlVencimiento = titulos.multiply(CETE_NOMINAL);
        
        // 3. Calcular ganancia proporcional (Interés devengado)
        BigDecimal gananciaTotalPosible = valorAlVencimiento.subtract(cete.getMontoInvertido());
        BigDecimal factorTiempo = bd(diasTranscurridos).divide(bd(cete.getPlazo()), SCALE, RoundingMode.HALF_UP);
        BigDecimal gananciaGenerada = gananciaTotalPosible.multiply(factorTiempo);
        
        BigDecimal montoVentaFinal = cete.getMontoInvertido().add(gananciaGenerada);

        // 1. Actualizar Balances (Mover de inversión a efectivo)
        portafolio.setCetesBalance(portafolio.getCetesBalance().subtract(cete.getMontoInvertido()));
        portafolio.setCashBalance(portafolio.getCashBalance().add(montoVentaFinal));
        portafolio.setTotalBalance(portafolio.getTotalBalance().add(gananciaGenerada));

        if (includeBonddia) {
            BigDecimal bondsAmount = portafolio.getBondsBalance();
            portafolio.setCashBalance(portafolio.getCashBalance().add(bondsAmount));
            portafolio.setBondsBalance(BigDecimal.ZERO);
            transaccionService.registrarTransaccion(portafolio.getUser(), TipoTransaccion.VENTA, bondsAmount, "Bonddia Liquidation (included in CETE sale)");
        }

        Portafolio updated = portafolioRepository.save(portafolio);

        // 2. Registrar Transacción de Venta
        String description = String.format("Early CETE Sale - Days held: %d/%d", diasTranscurridos, cete.getPlazo());
        transaccionService.registrarTransaccion(portafolio.getUser(), TipoTransaccion.VENTA, montoVentaFinal, description);

        // 3. Eliminar la tenencia
        ceteRepository.delete(cete);

        return updated;
    }

    public List<Cete> obtenerInversiones(Long portfolioId) {
        return ceteRepository.findByPortafolioId(portfolioId);
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