"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PercentIcon from "@mui/icons-material/Percent";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SavingsIcon from "@mui/icons-material/Savings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useAuth } from "../context/AuthContext";

const terms = [
  { value: 28, label: "28 dias", helper: "Liquidez corta" },
  { value: 91, label: "91 dias", helper: "Balance medio" },
  { value: 182, label: "182 dias", helper: "Renta semestral" },
  { value: 364, label: "364 dias", helper: "Horizonte anual" },
];

function StatPill({ icon, label, value }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: "14px",
        bgcolor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ color: "rgba(255,255,255,0.7)" }}
      >
        {icon}
        <Typography sx={{ fontSize: 12, fontWeight: 800 }}>{label}</Typography>
      </Stack>
      <Typography
        sx={{ mt: 0.8, fontSize: 20, fontWeight: 900, color: "#fff" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function ResumenRow({ label, value, highlight = false, color = "#FFFFFF" }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Typography sx={{ color: "rgba(255,255,255,0.66)", fontSize: 14 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          color,
          fontWeight: highlight ? 900 : 800,
          fontSize: highlight ? 18 : 15,
          textAlign: "right",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function StyledField(props) {
  return (
    <TextField
      fullWidth
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          bgcolor: "#EEF3F8",
          minHeight: 58,
          "& fieldset": { borderColor: "rgba(100,116,143,0.20)" },
          "&:hover fieldset": { borderColor: "rgba(49,65,85,0.35)" },
          "&.Mui-focused": {
            bgcolor: "#fff",
            boxShadow: "0 0 0 4px rgba(127,179,213,0.18)",
          },
          "&.Mui-focused fieldset": { borderColor: "#7FB3D5" },
        },
        "& .MuiInputLabel-root": { color: "#1F2937", fontWeight: 700 },
        "& .MuiInputLabel-root.Mui-focused": { color: "#0B1F3A" },
        ...props.sx,
      }}
    />
  );
}

export default function CetesCalculator() {
  const { user, calculateInversion, getCetesRates, buyCetes } = useAuth();
  const router = useRouter();

  const [monto, setMonto] = useState("");
  const [plazo, setPlazo] = useState("");
  const [tasa, setTasa] = useState("");
  const [titulos, setTitulos] = useState("");
  const [isManualRate, setIsManualRate] = useState(true);
  const [defaultRates, setDefaultRates] = useState({});
  const [calculo, setCalculo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculationMode, setCalculationMode] = useState("monto");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const rates = await getCetesRates();
        setDefaultRates(rates);
      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    };

    fetchRates();
  }, [getCetesRates]);

  const getPrecioLocal = useCallback(() => {
    const t = parseFloat(tasa) || 0;
    const p = parseInt(plazo) || 28;
    return 10 / (1 + ((t / 100) * p) / 360);
  }, [tasa, plazo]);

  const precioActual = getPrecioLocal();

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
        console.error("Error calculo:", error);
      } finally {
        setLoading(false);
      }
    },
    [calculateInversion],
  );

  const handleCalculateClick = () => {
    const numMonto = Number(monto);
    if (!monto || numMonto < 100 || numMonto > 10000000) {
      alert("El monto debe estar entre 100 y 10,000,000");
      return;
    }
    if (!plazo) {
      alert("Por favor selecciona un plazo");
      return;
    }
    if (!tasa) {
      alert("Por favor ingresa una tasa");
      return;
    }
    ejecutarCalculo(monto, plazo, tasa);
  };

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

    const precioLocal =
      10 / (1 + ((Number(currentTasa) / 100) * Number(nuevoPlazo)) / 360);

    if (calculationMode === "monto" && monto !== "") {
      setTitulos(Math.floor(Number(monto) / precioLocal));
    } else if (titulos !== "") {
      setMonto(Number((Number(titulos) * precioLocal).toFixed(2)));
    }
  };

  const handleMontoChange = (e) => {
    const val = e.target.value;
    setCalculationMode("monto");
    setMonto(val);
    if (val === "" || Number(val) <= 0) {
      setTitulos("");
      return;
    }
    setTitulos(Math.floor(Number(val) / precioActual));
  };

  const handleTitulosChange = (e) => {
    const val = e.target.value;
    setCalculationMode("titulos");
    setTitulos(val);
    if (val === "" || Number(val) <= 0) {
      setMonto("");
      return;
    }
    setMonto(Number((Number(val) * precioActual).toFixed(2)));
  };

  const handleReset = () => {
    setMonto("");
    setPlazo("");
    setTitulos("");
    setCalculationMode("monto");
    setTasa("");
    setCalculo(null);
  };

  const getFechaVencimiento = () => {
    const date = new Date();
    date.setDate(date.getDate() + Number(plazo));
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTasaPeriodo = () => {
    if (!tasa || !plazo) return "0.00";
    return ((tasa * plazo) / 360).toFixed(2);
  };

  const getRendimientoReal = () => {
    if (!calculo || !calculo.totalFinal || !calculo.inversionCetes)
      return "0.00";
    const gananciaNeta =
      calculo.totalFinal - calculo.remanente - calculo.inversionCetes;
    return ((gananciaNeta / calculo.inversionCetes) * 100).toFixed(2);
  };

  // Definición de canBuy para habilitar/deshabilitar el botón de compra
  const canBuy =
    !loading &&
    !!calculo && // Debe haber un cálculo previo (haber picado a Calcular)
    !!user &&
    Number(user.balance || 0) >= Number(monto || 0) &&
    Number(monto || 0) >= 100 &&
    Number(monto || 0) <= 10000000;

  const handleBuy = async () => {
    try {
      await buyCetes(Number(monto), Number(plazo), Number(tasa));
      alert("Inversion realizada con exito");
      router.push("/portafolio");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <Box sx={{ p: { xs: 0, md: 0 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1.35fr) minmax(360px, 0.9fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Box>
          <Paper
            sx={{
              p: { xs: 2.5, md: 3.5 },
              height: "100%",
              borderRadius: "18px",
              border: "1px solid #D8E3EC",
              boxShadow: "0 18px 44px rgba(16,24,32,0.07)",
              bgcolor: "rgba(255,255,255,0.92)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#7FB3D5",
                    fontSize: 12,
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                >
                  Define tu operacion
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ mt: 0.5, color: "#1F2937", fontWeight: 950 }}
                >
                  Configura la inversion
                </Typography>
                <Typography sx={{ mt: 0.8, color: "#1F2937", fontSize: 14 }}>
                  Ajusta monto, titulos, plazo y tasa. El resumen se actualiza
                  automaticamente.
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={2.2}>
              <Grid item xs={12} md={6}>
                <StyledField
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
              <Grid item xs={12} md={6}>
                <StyledField
                  label="Numero de titulos"
                  name="titulos"
                  type="number"
                  value={titulos}
                  onChange={handleTitulosChange}
                />
              </Grid>
              {/*<Grid item xs={12} md={6}>
                <StyledField
                  select
                  label="Plazo"
                  value={plazo || ""}
                  onChange={handlePlazoChange}
                >
                  {terms.map((term) => (
                    <MenuItem key={term.value} value={term.value}>
                      {term.label} - {term.helper}
                    </MenuItem>
                  ))}
                </StyledField>
              </Grid>*/}
              <Grid item xs={12} md={6}>
                <StyledField
                  label="Tasa anual"
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
            </Grid>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: "10px",
                bgcolor: "#EEF3F8",
                border: "1px solid #D8E3EC",
              }}
            >
              <Grid container spacing={1.5}>
                {terms.map((term) => {
                  const selected = Number(plazo) === term.value;
                  return (
                    <Grid item xs={6} md={3} key={term.value}>
                      <Button
                        fullWidth
                        onClick={() =>
                          handlePlazoChange({ target: { value: term.value } })
                        }
                        sx={{
                          py: 1.4,
                          borderRadius: "10px",
                          display: "block",
                          textAlign: "left",
                          bgcolor: selected ? "#0B1F3A" : "#FFFFFF",
                          color: selected ? "#FFFFFF" : "#0B1F3A",
                          border: "1px solid #D8E3EC",
                          boxShadow: selected
                            ? "0 14px 28px rgba(16,24,32,0.18)"
                            : "none",
                          "&:hover": {
                            bgcolor: selected ? "#0B1F3A" : "#FFFFFF",
                          },
                        }}
                      >
                        <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                          {term.label}
                        </Typography>
                        <Typography sx={{ opacity: 0.68, fontSize: 12 }}>
                          {term.helper}
                        </Typography>
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            <Stack spacing={2} sx={{ mt: 3 }}>
              {/* Fila 1: Calcular y Limpiar */}
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleCalculateClick}
                  disabled={loading}
                  sx={{
                    py: 1.6,
                    bgcolor: "#0B1F3A",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#1D4E89" },
                  }}
                >
                  Calcular
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RestartAltIcon />}
                  onClick={handleReset}
                  sx={{
                    py: 1.6,
                    color: "#0B1F3A",
                    borderColor: "#D8E3EC",
                    fontWeight: 700,
                  }}
                >
                  Limpiar
                </Button>
              </Stack>

              {/* Fila 2: Comprar (Confirmar Inversión) */}
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <RequestQuoteIcon />
                  )
                }
                disabled={!canBuy}
                onClick={handleBuy}
                sx={{
                  py: 2,
                  fontWeight: 900,
                  fontSize: "1.1rem",
                }}
              >
                Comprar (Confirmar Inversión)
              </Button>
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ position: { lg: "sticky" }, top: { lg: 96 } }}>
          <Paper
            sx={{
              p: { xs: 2.5, md: 3.5 },
              minHeight: { xs: "auto", lg: 560 },
              height: "100%",
              borderRadius: "18px",
              color: "#fff",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
              background: `
                radial-gradient(circle at 88% 8%, rgba(127,179,213,0.28), transparent 30%),
                linear-gradient(145deg, #1D4E89 0%, #0B1F3A 100%)
              `,
              boxShadow: "0 30px 76px rgba(16,24,32,0.22)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.62)",
                    fontSize: 13,
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                >
                  Resumen de la operacion
                </Typography>
                <Typography
                  sx={{ mt: 0.8, fontSize: 34, lineHeight: 1, fontWeight: 900 }}
                >
                  {calculo?.totalFinal
                    ? `$${Number(calculo.totalFinal).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`
                    : "$0.00"}
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <StatPill
                  icon={<PercentIcon fontSize="small" />}
                  label="Tasa periodo"
                  value={`${getTasaPeriodo()}%`}
                />
              </Grid>
              <Grid item xs={6}>
                <StatPill
                  icon={<CalendarMonthIcon fontSize="small" />}
                  label="Vence"
                  value={getFechaVencimiento()}
                />
              </Grid>
              <Grid item xs={6}>
                <StatPill
                  icon={<TrendingUpIcon fontSize="small" />}
                  label="Titulos"
                  value={calculo?.titulosCetes || titulos || 0}
                />
              </Grid>
              <Grid item xs={6}>
                <StatPill
                  icon={<AccountBalanceWalletIcon fontSize="small" />}
                  label="Remanente"
                  value={`$${Number(calculo?.remanente || 0).toFixed(2)}`}
                />
              </Grid>
            </Grid>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 2.5 }} />

            {loading ? (
              <Box
                sx={{ display: "grid", placeItems: "center", minHeight: 210 }}
              >
                <CircularProgress sx={{ color: "#EEF3F8" }} />
              </Box>
            ) : (
              <Stack spacing={2}>
                <ResumenRow
                  label="Precio actual CETE"
                  value={`$${precioActual.toFixed(4)}`}
                />
                <ResumenRow
                  label="Inversion real"
                  value={`$${Number(calculo?.inversionCetes || 0).toLocaleString("es-MX")}`}
                />
                <ResumenRow
                  label="ISR estimado"
                  value={`$${Number(calculo?.isr || 0).toFixed(2)}`}
                  color="#EEF3F8"
                />
                <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
                <ResumenRow
                  label="Total al vencimiento"
                  value={
                    calculo?.totalFinal
                      ? `$${Number(calculo.totalFinal).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`
                      : "$0.00"
                  }
                  highlight
                />
              </Stack>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
