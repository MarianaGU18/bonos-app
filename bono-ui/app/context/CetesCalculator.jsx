"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaidIcon from "@mui/icons-material/Paid";

import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";

import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

export default function CetesCalculator() {
  const { user, calculateInversion, getCetesRates, buyCetes } = useAuth();

  const router = useRouter();

  // =========================
  // ESTADOS
  // =========================

  const [monto, setMonto] = useState(1000);

  const [plazo, setPlazo] = useState(28);

  const [tasa, setTasa] = useState(6.45);

  const [titulos, setTitulos] = useState(100);

  const [isManualRate, setIsManualRate] = useState(false);

  const [defaultRates, setDefaultRates] = useState({});

  const [calculo, setCalculo] = useState(null);

  const [loading, setLoading] = useState(false);

  // NUEVO:
  // Define si el usuario está calculando
  // desde monto o desde títulos

  const [calculationMode, setCalculationMode] = useState("monto");

  // =========================
  // CARGAR TASAS
  // =========================

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const rates = await getCetesRates();

        setDefaultRates(rates);

        const rate28 = rates[28] || rates["28"];

        if (rate28) {
          setTasa(rate28);
        }
      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    };

    fetchRates();
  }, [getCetesRates]);

  // =========================
  // PRECIO CETE LOCAL
  // =========================

  const getPrecioLocal = useCallback(() => {
    const t = parseFloat(tasa) || 0;

    const p = parseInt(plazo) || 28;

    // Fórmula financiera real CETES

    return 10 / (1 + ((t / 100) * p) / 360);
  }, [tasa, plazo]);

  const precioActual = getPrecioLocal();

  // =========================
  // EJECUTAR CÁLCULO
  // =========================

  const ejecutarCalculo = useCallback(
    async (m, p, t) => {
      try {
        setLoading(true);

        const result = await calculateInversion(
          Number(m),
          Number(p),
          Number(t),
        );

        setCalculo(result);
      } catch (error) {
        console.error("Error cálculo:", error);
      } finally {
        setLoading(false);
      }
    },
    [calculateInversion],
  );

  // =========================
  // RECALCULAR
  // =========================

  useEffect(() => {
    const timer = setTimeout(() => {
      if (monto && Number(monto) >= 10) {
        ejecutarCalculo(monto, plazo, tasa);
      } else {
        setCalculo(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [monto, plazo, tasa, ejecutarCalculo]);

  // =========================
  // CAMBIAR PLAZO
  // =========================

  const handlePlazoChange = (e) => {
    const nuevoPlazo = e.target.value;
    setPlazo(nuevoPlazo);
    const tasaSugerida =
      defaultRates[nuevoPlazo] || defaultRates[String(nuevoPlazo)];

    let currentTasa = tasa;
    if (!isManualRate && tasaSugerida) {
      setTasa(tasaSugerida);
      currentTasa = tasaSugerida;
    }

    // Recalcular títulos o monto basado en el precio actualizado localmente
    const precioLocal =
      10 / (1 + ((Number(currentTasa) / 100) * Number(nuevoPlazo)) / 360);

    if (calculationMode === "monto") {
      if (monto && monto !== "") {
        setTitulos(Math.floor(Number(monto) / precioLocal));
      }
    } else {
      if (titulos && titulos !== "") {
        const inversion = Number(titulos) * precioLocal;
        setMonto(Number(inversion.toFixed(2)));
      }
    }
  };

  // =========================
  // CAMBIAR MONTO
  // =========================

  const handleMontoChange = (e) => {
    const val = e.target.value;

    setCalculationMode("monto");

    setMonto(val);

    if (val === "" || Number(val) <= 0) {
      setTitulos("");
      return;
    }

    const cantidad = Math.floor(Number(val) / precioActual);

    setTitulos(cantidad);
  };

  // =========================
  // CAMBIAR TÍTULOS
  // =========================

  const handleTitulosChange = (e) => {
    const val = e.target.value;

    setCalculationMode("titulos");

    setTitulos(val);

    if (val === "" || Number(val) <= 0) {
      setMonto("");
      return;
    }

    const inversion = Number(val) * precioActual;

    setMonto(Number(inversion.toFixed(2)));
  };

  // =========================
  // RESET
  // =========================

  const handleReset = () => {
    setMonto(1000);

    setPlazo(28);

    setTitulos(0);

    setCalculationMode("monto");

    setIsManualRate(false);

    const rate28 = defaultRates[28] || defaultRates["28"];

    setTasa(rate28 || 6.45);

    setCalculo(null);
  };

  // =========================
  // FECHA VENCIMIENTO
  // =========================

  const getFechaVencimiento = () => {
    const date = new Date();

    date.setDate(date.getDate() + Number(plazo));

    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // TASA DEL PERIODO
  // =========================

  const getTasaPeriodo = () => {
    const factor = plazo / 360;

    return (tasa * factor).toFixed(2);
  };

  // =========================
  // RENDIMIENTO REAL
  // =========================

  const getRendimientoReal = () => {
    if (!calculo || !calculo.totalFinal || !calculo.inversionCetes) {
      return "0.00";
    }

    // Ganancia neta real

    const gananciaNeta =
      calculo.totalFinal - calculo.remanente - calculo.inversionCetes;

    const rendimiento = gananciaNeta / calculo.inversionCetes;

    return (rendimiento * 100).toFixed(2);
  };

  // =========================
  // COMPRAR
  // =========================

  const handleBuy = async () => {
    try {
      await buyCetes(Number(monto), Number(plazo), Number(tasa));

      alert("¡Inversión realizada con éxito!");

      router.push("/portafolio");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: (theme) => `
        linear-gradient(
          135deg,
          ${theme.palette.background.default} 0%,
          ${theme.palette.background.subtle} 50%,
          ${theme.palette.background.default} 100%
        )
      `,
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Grid container spacing={4}>
        {/* ===================== */}
        {/* LEFT PANEL */}
        {/* ===================== */}

        <Grid item xs={12} sm={7}>
          <Paper
            sx={{
              p: 4,
              height: "auto",
              borderRadius: 6,
              border: "2px solid #1976d2",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 1,
                fontWeight: 800,
              }}
            >
              Investment Parameters
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 4,
              }}
            >
              Configure your CETES investment simulation.
            </Typography>

            <Grid container spacing={2}>
              {/* MONTO */}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Monto a invertir"
                  name="monto"
                  type="number"
                  value={monto}
                  onChange={handleMontoChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* TITULOS */}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número de títulos"
                  name="titulos"
                  type="number"
                  value={titulos}
                  onChange={handleTitulosChange}
                />
              </Grid>

              {/* PLAZO */}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Plazo"
                  value={plazo}
                  onChange={handlePlazoChange}
                >
                  <MenuItem value={28}>28 días</MenuItem>

                  <MenuItem value={91}>91 días</MenuItem>

                  <MenuItem value={182}>182 días</MenuItem>

                  <MenuItem value={364}>364 días</MenuItem>
                </TextField>
              </Grid>

              {/* TASA */}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tasa"
                  type="number"
                  value={tasa}
                  onChange={(e) => {
                    setTasa(e.target.value);

                    setIsManualRate(true);
                  }}
                  helperText="Puedes ajustar la tasa manualmente"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* BOTONES */}

              <Grid item xs={12} sx={{ mt: 1 }}>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<RequestQuoteIcon />}
                    disabled={
                      loading ||
                      !calculo ||
                      !user ||
                      user.balance < monto ||
                      monto < 100
                    }
                    onClick={handleBuy}
                    sx={{
                      py: 1.6,
                      fontWeight: 700,
                    }}
                  >
                    Confirmar Inversión
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleReset}
                    sx={{
                      py: 1.6,
                      fontWeight: 700,
                    }}
                  >
                    Limpiar
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* ===================== */}
        {/* RIGHT PANEL */}
        {/* ===================== */}

        <Grid item xs={12} sm={5}>
          {loading ? (
            <Paper
              sx={{
                p: 6,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 6,
                minHeight: "450px",
              }}
            >
              <CircularProgress />
            </Paper>
          ) : calculo ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 6,
                bgcolor: "primary.main",
                color: "white",
                minHeight: "450px",
                display: "flex",
                flexDirection: "column",
                border: "2px solid #8b5cf6",
                boxShadow: (theme) => theme.customShadows.md,
                background: (theme) => `
                  linear-gradient(135deg, 
                  ${theme.palette.primary.main} 0%, 
                  ${theme.palette.primary.dark} 100%)
                `,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 800, letterSpacing: 1 }}
              >
                RESUMEN DE OPERACIÓN
              </Typography>
              <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.2)" }} />

              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <ResumenRow
                  label="Tasa del periodo:"
                  value={`${getTasaPeriodo()}%`}
                />
                <ResumenRow
                  label="Precio actual CETE:"
                  value={`$${precioActual.toFixed(4)}`}
                />
                <ResumenRow
                  label="Cantidad de títulos:"
                  value={calculo.titulosCetes}
                />

                <Divider
                  sx={{
                    my: 1,
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderStyle: "dashed",
                  }}
                />

                <ResumenRow
                  label="Inversión real:"
                  value={`$${Number(calculo.inversionCetes).toLocaleString("es-MX")}`}
                />
                <ResumenRow
                  label="Remanente:"
                  value={`$${Number(calculo.remanente).toFixed(2)}`}
                />

                <Divider
                  sx={{
                    my: 1,
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderStyle: "dashed",
                  }}
                />

                <ResumenRow
                  label="Fecha de vencimiento:"
                  value={getFechaVencimiento()}
                />
                <ResumenRow
                  label="Impuesto (ISR):"
                  value={`$${Number(calculo.isr).toFixed(2)}`}
                  color="#ffab91"
                />
              </Stack>

              <Box sx={{ mt: "auto", pt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography variant="h6">Obtienes al final:</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    $
                    {calculo.totalFinal?.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1,
                    opacity: 0.6,
                    textAlign: "right",
                  }}
                >
                  *Rendimiento esperado: {getRendimientoReal()}%
                </Typography>
              </Box>
            </Paper>
          ) : (
            <Paper
              sx={{
                p: 6,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                }}
              >
                Start Your Simulation
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Enter an investment amount and select a term to simulate your
                CETES investment.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

// =========================
// COMPONENTE RESUMEN
// =========================

function ResumenRow({ label, value, color = "white" }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          opacity: 0.8,
        }}
      >
        {label}
      </Typography>

      <Typography variant="subtitle1" fontWeight={700} sx={{ color }}>
        {value}
      </Typography>
    </Box>
  );
}
