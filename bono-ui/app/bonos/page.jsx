"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useAuth } from "../context/AuthContext";
import CalculateIcon from "@mui/icons-material/Calculate";
import PercentIcon from "@mui/icons-material/Percent";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PaidIcon from "@mui/icons-material/Paid";

const FRECUENCIAS = ["MENSUAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"];
const API_BASE = "https://bonos-app-production.up.railway.app";

// ─── Subcomponents ────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BonosPage() {
  const { user, authFetch } = useAuth();
  const [portafolio, setPortafolio] = useState({ cashBalance: 0 });

  useEffect(() => {
    if (!user) return;
    authFetch(`/portafolio/user/${user.id}`)
      .then((r) => r.json())
      .then((data) => setPortafolio(data))
      .catch(() => {});
  }, [user]);

  const [form, setForm] = useState({
    valorNominal: "",
    tasaCuponAnual: "",
    tasaDescuento: "",
    plazoDias: "",
    frecuenciaPago: "SEMESTRAL",
    precioCompra: "",
  });
  const [calculo, setCalculo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const ejecutarCalculo = useCallback(async (params) => {
    const {
      valorNominal,
      tasaCuponAnual,
      tasaDescuento,
      plazoDias,
      frecuenciaPago,
      precioCompra,
    } = params;

    if (!tasaCuponAnual || Number(tasaCuponAnual) <= 0) {
      setError("La tasa cupón anual debe ser mayor a 0");
      return;
    }
    if (!valorNominal || valorNominal <= 0) {
      setError(
        "Todos los campos deben ser mayores a 0 y las tasas no pueden superar 100%.",
      );
      return;
    }
    if (!precioCompra || precioCompra <= 0) {
      setError(
        "Todos los campos deben ser mayores a 0 y las tasas no pueden superar 100%.",
      );
      return;
    }
    if (tasaCuponAnual < 0 || tasaCuponAnual > 100) {
      setError(
        "Todos los campos deben ser mayores a 0 y las tasas no pueden superar 100%.",
      );
      return;
    }
    if (!tasaDescuento || tasaDescuento <= 0 || tasaDescuento > 100) {
      setError(
        "Todos los campos deben ser mayores a 0 y las tasas no pueden superar 100%.",
      );
      return;
    }
    if (!plazoDias || plazoDias <= 0) {
      setError(
        "Todos los campos deben ser mayores a 0 y las tasas no pueden superar 100%.",
      );
      return;
    }
    if (!frecuenciaPago) {
      setError("Selecciona una frecuencia de pago.");
      return;
    }
    setError("");

    const url = `${API_BASE}/api/bonos/calcular?valorNominal=${valorNominal}&tasaCuponAnual=${tasaCuponAnual}&tasaDescuento=${tasaDescuento}&plazoDias=${plazoDias}&frecuenciaPago=${frecuenciaPago}&precioCompra=${precioCompra || 0}`;

    try {
      setLoading(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCalculo(data);
    } catch (err) {
      console.error("Error cálculo bono:", err);
      setCalculo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    setForm({
      valorNominal: "",
      tasaCuponAnual: "",
      tasaDescuento: "",
      plazoDias: "",
      frecuenciaPago: "SEMESTRAL",
      precioCompra: "",
    });
    setCalculo(null);
    setError("");
  };

  const handleConfirmarInversion = async () => {
    if (!calculo || !user) return;

    if (portafolio.cashBalance < Number(form.precioCompra)) {
      setError(
        "Saldo insuficiente en tu cartera para realizar esta inversión.",
      );
      return;
    }

    try {
      const res = await authFetch("/bonos-activos/comprar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          valorNominal: Number(form.valorNominal),
          precioCompra: Number(form.precioCompra),
          precioTeorico: Number(calculo.precioTeorico),
          tasaCuponAnual: Number(form.tasaCuponAnual),
          tasaDescuento: Number(form.tasaDescuento),
          plazoDias: Number(form.plazoDias),
          frecuenciaPago: form.frecuenciaPago,
          rendimiento: Number(calculo.rendimiento),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        if (err.includes("Insufficient funds")) {
          setError(
            "Saldo insuficiente en tu cartera para realizar esta inversión.",
          );
        } else {
          setError("No se pudo completar la compra. Intenta nuevamente.");
        }
        return;
      }

      setError("");
      setSuccessMessage(
        "¡Inversión confirmada! Tu bono ha sido registrado en tu cartera.",
      );
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    }
  };

  const rendimiento = calculo
    ? Math.abs(Number(calculo.rendimiento)) < 0.005
      ? "0.00"
      : Number(calculo.rendimiento).toFixed(2)
    : "0.00";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 8% 8%, rgba(127,179,213,0.13), transparent 25%),
          radial-gradient(circle at 88% 9%, rgba(29,78,137,0.10), transparent 24%),
          linear-gradient(180deg, #FFFFFF 0%, #EEF3F8 48%, #EEF3F8 100%)
        `,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        {/* HEADER */}
        <Paper
          sx={{
            mb: 3,
            p: { xs: 3, md: 4 },
            borderRadius: "20px",
            color: "#fff",
            overflow: "hidden",
            background: `
              radial-gradient(circle at 84% 12%, rgba(127,179,213,0.25), transparent 28%),
              linear-gradient(145deg, #1D4E89 0%, #0B1F3A 100%)
            `,
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 30px 76px rgba(16,24,32,0.18)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2.4}
            alignItems={{ sm: "center" }}
          >
            <Box
              sx={{
                width: 62,
                height: 62,
                borderRadius: "16px",
                bgcolor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "grid",
                placeItems: "center",
                color: "#EEF3F8",
              }}
            >
              <AccountBalanceIcon sx={{ fontSize: 34 }} />
            </Box>
            <Box>
              <Chip
                label="Calculadora de bonos"
                sx={{
                  mb: 1.2,
                  bgcolor: "rgba(127,179,213,0.16)",
                  color: "#EEF3F8",
                  border: "1px solid rgba(127,179,213,0.28)",
                }}
              />
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 36, md: 52 },
                  lineHeight: 1,
                  fontWeight: 950,
                }}
              >
                Valuación de Bonos
              </Typography>
              <Typography
                sx={{
                  mt: 1.4,
                  maxWidth: 720,
                  color: "rgba(255,255,255,0.66)",
                  fontSize: 17,
                  lineHeight: 1.7,
                }}
              >
                Calcula el precio teórico y rendimiento de bonos de tasa fija
                con descuento por periodo.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* CALCULADORA */}
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
          {/* LEFT: FORMULARIO */}
          <Paper
            sx={{
              p: { xs: 2.5, md: 3.5 },
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
                  Parámetros del bono
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ mt: 0.5, color: "#1F2937", fontWeight: 950 }}
                >
                  Configura la valuación
                </Typography>
                <Typography sx={{ mt: 0.8, color: "#1F2937", fontSize: 14 }}>
                  Ingresa los datos del bono y presiona Calcular para obtener el
                  precio teórico.
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={2.2}>
              <Grid item xs={12} md={6}>
                <StyledField
                  label="Valor Nominal"
                  name="valorNominal"
                  type="number"
                  value={form.valorNominal}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledField
                  label="Precio de Compra"
                  name="precioCompra"
                  type="number"
                  value={form.precioCompra}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledField
                  label="Tasa Cupón Anual"
                  name="tasaCuponAnual"
                  type="number"
                  value={form.tasaCuponAnual}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledField
                  label="Tasa de Descuento"
                  name="tasaDescuento"
                  type="number"
                  value={form.tasaDescuento}
                  onChange={handleChange}
                  helperText="Tasa de mercado anual"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <StyledField
                  label="Plazo (días)"
                  name="plazoDias"
                  type="number"
                  value={form.plazoDias}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <StyledField
                  select
                  label="Frecuencia de Pago"
                  name="frecuenciaPago"
                  value={form.frecuenciaPago}
                  onChange={handleChange}
                  sx={{ minWidth: 200 }}
                >
                  {FRECUENCIAS.map((f) => (
                    <MenuItem key={f} value={f}>
                      {f}
                    </MenuItem>
                  ))}
                </StyledField>
              </Grid>
            </Grid>

            {error && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: "10px",
                  bgcolor: "rgba(211,47,47,0.08)",
                  border: "1px solid rgba(211,47,47,0.2)",
                }}
              >
                <Typography sx={{ color: "#d32f2f", fontSize: 13 }}>
                  {error}
                </Typography>
              </Box>
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 3 }}
            >
              <Button
                fullWidth
                variant="contained"
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <CalculateIcon />
                  )
                }
                disabled={loading}
                onClick={() => ejecutarCalculo(form)}
                sx={{
                  py: 1.6,
                  bgcolor: "#0B1F3A",
                  "&:hover": { bgcolor: "#1D4E89" },
                }}
              >
                {loading ? "Calculando..." : "Calcular"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
                sx={{ py: 1.6, color: "#0B1F3A", borderColor: "#D8E3EC" }}
              >
                Limpiar
              </Button>
            </Stack>
            {calculo && (
              <Button
                fullWidth
                variant="contained"
                color="success"
                sx={{ py: 1.6, fontWeight: 700, mt: 1 }}
                onClick={handleConfirmarInversion}
              >
                Confirmar Inversión
              </Button>
            )}
          </Paper>

          {/* RIGHT: RESULTADOS */}
          <Box sx={{ position: { lg: "sticky" }, top: { lg: 96 } }}>
            <Paper
              sx={{
                p: { xs: 2.5, md: 3.5 },
                minHeight: { xs: "auto", lg: 560 },
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
                    Resumen de valuación
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.8,
                      fontSize: 34,
                      lineHeight: 1,
                      fontWeight: 900,
                    }}
                  >
                    {calculo
                      ? `$${Number(calculo.precioTeorico).toLocaleString("es-MX", { minimumFractionDigits: 4 })}`
                      : "$0.00"}
                  </Typography>
                </Box>
                <Chip
                  label={`${rendimiento}% rendimiento`}
                  sx={{
                    bgcolor: "rgba(127,179,213,0.16)",
                    color: "#EEF3F8",
                    fontWeight: 900,
                  }}
                />
              </Stack>

              <Grid container spacing={1.5} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <StatPill
                    icon={<PaidIcon fontSize="small" />}
                    label="Cupón / periodo"
                    value={
                      calculo
                        ? `$${Number(calculo.cuponPorPeriodo).toFixed(4)}`
                        : "$0.00"
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatPill
                    icon={<PercentIcon fontSize="small" />}
                    label="Tasa descuento"
                    value={
                      calculo
                        ? `${Number(calculo.tasaDescuento).toFixed(2)}%`
                        : "—"
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatPill
                    icon={<TrendingUpIcon fontSize="small" />}
                    label="Periodos"
                    value={calculo ? calculo.numPeriodos : "—"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatPill
                    icon={<AccountBalanceIcon fontSize="small" />}
                    label="Precio compra"
                    value={
                      calculo
                        ? `$${Number(calculo.precioCompra).toFixed(4)}`
                        : "$0.00"
                    }
                  />
                </Grid>
              </Grid>

              <Divider
                sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 2.5 }}
              />

              {loading ? (
                <Box
                  sx={{ display: "grid", placeItems: "center", minHeight: 160 }}
                >
                  <CircularProgress sx={{ color: "#EEF3F8" }} />
                </Box>
              ) : calculo ? (
                <Stack spacing={2}>
                  <ResumenRow
                    label="VP Cupones"
                    value={`$${Number(calculo.vpCupones).toFixed(4)}`}
                  />
                  <ResumenRow
                    label="VP Valor Nominal"
                    value={`$${Number(calculo.vpValorNominal).toFixed(4)}`}
                  />
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
                  <ResumenRow
                    label="Precio Teórico"
                    value={`$${Number(calculo.precioTeorico).toFixed(4)}`}
                    highlight
                  />
                </Stack>
              ) : (
                <Box sx={{ textAlign: "center", py: 4, opacity: 0.6 }}>
                  <Typography sx={{ fontSize: 15 }}>
                    Ingresa los parámetros y presiona Calcular para ver la
                    valuación.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage("")}
        >
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
