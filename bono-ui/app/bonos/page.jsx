"use client";

import React, { useState, useCallback } from "react";
import {
  Box,
  Container,
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
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const FRECUENCIAS = ["MENSUAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"];
const API_BASE = "http://localhost:8080";

export default function BonosPage() {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const ejecutarCalculo = useCallback(async (params) => {
    const { valorNominal, tasaCuponAnual, tasaDescuento, plazoDias, frecuenciaPago, precioCompra } = params;

    if (!valorNominal || valorNominal <= 0) { setError("Por favor ingresa valores válidos: todos los campos deben ser mayores a 0 y las tasas no pueden superar 100%"); return; }
    if (!precioCompra || precioCompra <= 0) { setError("Por favor ingresa valores válidos: todos los campos deben ser mayores a 0 y las tasas no pueden superar 100%"); return; }
    if (tasaCuponAnual < 0 || tasaCuponAnual > 100) { setError("Por favor ingresa valores válidos: todos los campos deben ser mayores a 0 y las tasas no pueden superar 100%"); return; }
    if (!tasaDescuento || tasaDescuento <= 0 || tasaDescuento > 100) { setError("Por favor ingresa valores válidos: todos los campos deben ser mayores a 0 y las tasas no pueden superar 100%"); return; }
    if (!plazoDias || plazoDias <= 0) { setError("Por favor ingresa valores válidos: todos los campos deben ser mayores a 0 y las tasas no pueden superar 100%"); return; }
    if (!frecuenciaPago) { setError("Por favor ingresa valores válidos: todos los campos deben ser mayores a 0 y las tasas no pueden superar 100%"); return; }
    setError("");

    const url = `${API_BASE}/api/bonos/calcular?valorNominal=${valorNominal}&tasaCuponAnual=${tasaCuponAnual}&tasaDescuento=${tasaDescuento}&plazoDias=${plazoDias}&frecuenciaPago=${frecuenciaPago}&precioCompra=${precioCompra || 0}`;
    console.log("Llamando al backend:", url);

    try {
      setLoading(true);
      const res = await fetch(url);
      console.log("Respuesta status:", res.status);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("Datos recibidos:", data);
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
  };

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
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>

        {/* HEADER */}
        <Paper
          sx={{
            mb: 5,
            p: { xs: 4, md: 5 },
            background: (theme) => `
              linear-gradient(
                135deg,
                ${theme.palette.primary.main} 0%,
                ${theme.palette.background.dark} 100%
              )
            `,
            color: "white",
            border: "2px solid #ff1744",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(0, 242, 20, 0.94)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AccountBalanceIcon sx={{ fontSize: 38 }} />
            </Box>
            <Box>
              <Typography variant="h3">Bond Valuation</Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
                Calculate the theoretical price and yield of fixed-rate bonds
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* CALCULADORA */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>

            {/* LEFT PANEL */}
            <Grid item xs={12} sm={7}>
              <Paper
                sx={{
                  p: 4,
                  height: "auto",
                  borderRadius: 6,
                  border: "2px solid #1976d2",
                }}
              >
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 800 }}>
                  Bond Parameters
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Configure your fixed-rate bond valuation.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Valor Nominal"
                      name="valorNominal"
                      type="number"
                      value={form.valorNominal}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Precio de Compra"
                      name="precioCompra"
                      type="number"
                      value={form.precioCompra}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tasa Cupón Anual"
                      name="tasaCuponAnual"
                      type="number"
                      value={form.tasaCuponAnual}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tasa de Descuento"
                      name="tasaDescuento"
                      type="number"
                      value={form.tasaDescuento}
                      onChange={handleChange}
                      helperText="Tasa de mercado anual"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Plazo (días)"
                      name="plazoDias"
                      type="number"
                      value={form.plazoDias}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Frecuencia de Pago"
                      name="frecuenciaPago"
                      value={form.frecuenciaPago}
                      onChange={handleChange}
                    >
                      {FRECUENCIAS.map((f) => (
                        <MenuItem key={f} value={f}>{f}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Stack spacing={2}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => ejecutarCalculo(form)}
                        disabled={loading}
                        sx={{ py: 1.6, fontWeight: 700 }}
                      >
                        {loading ? "Calculando..." : "Calcular"}
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleReset}
                        sx={{ py: 1.6, fontWeight: 700 }}
                      >
                        Limpiar
                      </Button>
                      {error && (
                        <Typography variant="body2" color="error">
                          {error}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* RIGHT PANEL */}
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
                    boxShadow: (theme) => theme.customShadows?.md,
                    background: (theme) => `
                      linear-gradient(135deg,
                      ${theme.palette.primary.main} 0%,
                      ${theme.palette.primary.dark} 100%)
                    `,
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, letterSpacing: 1 }}>
                    RESUMEN DE VALUACIÓN
                  </Typography>
                  <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.2)" }} />

                  <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <ResumenRow
                      label="Cupón por periodo:"
                      value={`$${Number(calculo.cuponPorPeriodo).toFixed(4)}`}
                    />
                    <ResumenRow
                      label="Número de periodos:"
                      value={calculo.numPeriodos}
                    />

                    <Divider sx={{ my: 1, bgcolor: "rgba(255,255,255,0.1)", borderStyle: "dashed" }} />

                    <ResumenRow
                      label="VP Cupones:"
                      value={`$${Number(calculo.vpCupones).toFixed(4)}`}
                    />
                    <ResumenRow
                      label="VP Valor Nominal:"
                      value={`$${Number(calculo.vpValorNominal).toFixed(4)}`}
                    />

                    <Divider sx={{ my: 1, bgcolor: "rgba(255,255,255,0.1)", borderStyle: "dashed" }} />

                    <ResumenRow
                      label="Precio de Compra:"
                      value={`$${Number(calculo.precioCompra).toFixed(4)}`}
                      color="#ffab91"
                    />
                  </Stack>

                  <Box sx={{ mt: "auto", pt: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <Typography variant="h6">Precio Teórico:</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900 }}>
                        ${Number(calculo.precioTeorico).toFixed(4)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 1, opacity: 0.6, textAlign: "right" }}
                    >
                      *Rendimiento esperado: {Math.abs(Number(calculo.rendimiento)) < 0.005 ? "0.00" : Number(calculo.rendimiento).toFixed(2)}%
                    </Typography>
                  </Box>
                </Paper>
              ) : (
                <Paper sx={{ p: 6, textAlign: "center", borderRadius: 6 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Start Your Simulation
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enter bond parameters to calculate its theoretical price and yield.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

function ResumenRow({ label, value, color = "white" }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        {label}
      </Typography>
      <Typography variant="subtitle1" fontWeight={700} sx={{ color }}>
        {value}
      </Typography>
    </Box>
  );
}
