"use client";

import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Alert,
  Paper,
  Divider,
  Stack,
  Snackbar,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SavingsIcon from "@mui/icons-material/Savings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { StyledTextField, PrimaryButton } from "../components/FormComponents";
import { useAuth } from "../context/AuthContext";

export default function CetesPage() {
  const router = useRouter();
  const { user, buyCetes, authFetch } = useAuth();

  const [formData, setFormData] = useState({
    plazo: 28,
    monto: 1000,
  });
  const [backendRates, setBackendRates] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 🔐 Validate session
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await authFetch("/cetes/tasas");
        if (res.ok) {
          const data = await res.json();
          setBackendRates(data);
        }
      } catch (err) {
        console.error("Failed to load rates", err);
      }
    };
    fetchRates();
  }, [authFetch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    // --- CÁLCULOS ALINEADOS A LA PLATAFORMA REAL ---
    setTimeout(() => {
      const montoInvertido = Number(formData.monto);
      const dias = Number(formData.plazo);

      // Usar tasa de Banxico si está disponible, de lo contrario un fallback
      const tCetes = backendRates ? backendRates[dias] / 100 : 0.0645;
      const tBonddia = 0.0598; // 5.98% (Alineado a tu ejemplo)

      // 1. Calcular precio de descuento del CETES (Valor Nominal = $10)
      const precioCetes = 10 / (1 + (tCetes * dias) / 360);

      // 2. Determinar títulos de CETES asignados
      const titulosCetes = Math.floor(montoInvertido / precioCetes);
      const inversionCetes = titulosCetes * precioCetes;

      // 3. El remanente primario se envía a BONDDIA automáticamente
      const sobranteParaBonddia = montoInvertido - inversionCetes;
      const precioBonddia = 2.325028; // Precio exacto para obtener 2 títulos con $4.65
      const titulosBonddia = Math.floor(sobranteParaBonddia / precioBonddia);
      const inversionBonddia = titulosBonddia * precioBonddia;

      // 4. Remanente final líquido en efectivo
      const remanente = sobranteParaBonddia - inversionBonddia;

      // 5. Cálculo de Rendimientos (Intereses Devengados)
      const interesBrutoCetes = titulosCetes * (10 - precioCetes);
      const interesBonddia = inversionBonddia * tBonddia * (dias / 360);

      // 6. Retención provisional de impuesto (ISR)
      const isr = (inversionCetes + inversionBonddia) * 0.009 * (dias / 366);

      // 7. Monto obtenido al final del plazo
      const totalFinal =
        inversionCetes +
        inversionBonddia +
        interesBrutoCetes +
        interesBonddia -
        isr +
        remanente;

      setResult({
        plazo: dias,
        tasaCetes: tCetes * 100,
        tasaBonddia: tBonddia * 100,
        montoInvertido,
        titulosCetes,
        titulosBonddia,
        inversionCetes,
        inversionBonddia,
        interesBrutoCetes,
        interesBonddia,
        remanente,
        isr,
        totalFinal,
      });
      setLoading(false);
    }, 800);
  };

  const handlePurchase = async () => {
    if (!user) return;
    setPurchaseLoading(true);
    setError(null);

    try {
      await buyCetes(formData.monto, formData.plazo);
      setSuccess(true);
      setTimeout(() => router.push("/portafolio"), 2000);
    } catch (err) {
      setError("Error processing purchase. Please check your balance.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  // 💰 Currency formatter (Formato estándar regional de México)
  const fmt = (val) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(val || 0);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Centrado horizontal
        alignItems: "center", // Centrado vertical
        minHeight: "100vh", // Ocupa el 100% de la altura de la pantalla
        width: "100%", // Asegura que el Box ocupe todo el ancho disponible
        bgcolor: "#ffffff", // Fondo blanco puro
        //border: "5px solid #eab308", // 🟡 AMARILLO: Wrapper principal de la página
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          pt: 5,
          pb: 6,
          px: 2, // Ajustado para compensar el spacing={4} del Grid y maximizar el ancho
          width: "100%",
          minHeight: "100vh",
          //border: "3px solid #ef4444", // 🔴 ROJO: Contenedor Root de la página
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            //border: "1px dashed #64748b",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 4,
              bgcolor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 3,
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
              //border: "1px solid",
              //borderColor: "grey.200",
            }}
          >
            <SavingsIcon sx={{ fontSize: 32, color: "#003366" }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                color: "#0f172a",
                lineHeight: 1.1,
              }}
            >
              CETES Valuation
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              Simulate your government bond investment returns
            </Typography>
          </Box>
        </Box>

        <Grid
          container
          spacing={4}
          sx={{ width: "100%" /*, border: "2px solid #7a7116" */ }}
        >
          {/* PANEL IZQUIERDO (Formulario de Parámetros) */}
          <Grid item xs={12} md={4} lg={3}>
            {/* 🔵 Columna Izquierda */}
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                bgcolor: "#f8fafc", // Blanco "fuerte" para resaltar
                boxShadow: 2,
                transition: "0.2s ease",

                //border: "2px solid #10b981", // 🟢 VERDE: Card del Formulario
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 5,
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, /*color: "#0f172a",*/ mb: 1 }}
              >
                Investment Parameters
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 4 }}
              >
                Configure your CETES investment simulation.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <StyledTextField
                  fullWidth
                  label="Investment Amount ($)"
                  name="monto"
                  type="number"
                  value={formData.monto}
                  onChange={handleChange}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#f8fafc",
                    },
                  }}
                />

                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel>Investment Term</InputLabel>
                  <Select
                    name="plazo"
                    value={formData.plazo}
                    label="Investment Term"
                    onChange={handleChange}
                    sx={{
                      borderRadius: 3,
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <MenuItem value={28}>1 Month (28 days)</MenuItem>
                    <MenuItem value={91}>3 Months (91 days)</MenuItem>
                    <MenuItem value={182}>6 Months (182 days)</MenuItem>
                    <MenuItem value={364}>1 Year (364 days)</MenuItem>
                  </Select>
                </FormControl>

                <PrimaryButton
                  type="submit"
                  disabled={loading}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    bgcolor: "#003366",
                    "&:hover": { bgcolor: "#002244" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Calculate Returns"
                  )}
                </PrimaryButton>

                <PrimaryButton
                  onClick={handlePurchase}
                  disabled={loading || purchaseLoading || !result}
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    bgcolor: "#1a83dd",
                    "&:hover": { bgcolor: "#1565c0" },
                  }}
                >
                  {purchaseLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Confirm Purchase"
                  )}
                </PrimaryButton>
              </Box>
            </Paper>
          </Grid>

          {/* PANEL DERECHO (Resumen estructurado como Ticket Oficial) */}
          <Grid
            item
            xs={12}
            md={result ? 4 : 8}
            lg={result ? 5 : 9}
            //sx={{ border: "2px solid #031d48" }}
          >
            {/* 🔵 AZUL: Columna Derecha */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                {error}
              </Alert>
            )}

            {result && (
              <Paper
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 4,
                  bgcolor: "#f8fafc", // Blanco "fuerte" para resaltar
                  position: "relative",
                  boxShadow: 2,
                  transition: "0.2s ease",

                  //border: "2px solid #a855f7", // 🟣 PÚRPURA: Sección de datos del ticket
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 5,
                  },
                }}
              >
                {/* Distintivo de Plazo Estilo Botón */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "#1a83dd",
                      color: "white",
                      fontWeight: 700,
                      px: 3,
                      py: 0.8,
                      borderRadius: 2,
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    CETES {result.plazo}
                  </Box>
                </Box>

                {/* Cabecera del desglose */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 3,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: "#003366", fontWeight: 700 }}
                  >
                    Amount Invested:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: "#003366",
                      fontFamily: "monospace",
                    }}
                  >
                    {fmt(result.montoInvertido)}
                  </Typography>
                </Box>

                {/* TABLA SUB-CONCEPTOS (Títulos y Tasas Brutas) */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gap: 1,
                    pb: 1.5,
                    borderBottom: "1px solid #e2e8f0",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    Units
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    Gross Rate
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Cetes:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "right",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: "#003366",
                    }}
                  >
                    {result.titulosCetes}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "right",
                      fontFamily: "monospace",
                      color: "#1a83dd",
                      fontWeight: 600,
                    }}
                  >
                    {result.tasaCetes.toFixed(2)} %
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    bonddia:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "right",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: "#003366",
                    }}
                  >
                    {result.titulosBonddia}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "right",
                      fontFamily: "monospace",
                      color: "#1a83dd",
                      fontWeight: 600,
                    }}
                  >
                    {result.tasaBonddia.toFixed(2)} %
                  </Typography>
                </Box>

                {/* VALORES MONETARIOS DESGLOSADOS */}
                <Stack spacing={1.5}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      CETES Investment:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", fontWeight: 600 }}
                    >
                      {fmt(result.inversionCetes)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Bonddia Investment:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", fontWeight: 600 }}
                    >
                      {fmt(result.inversionBonddia)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Gross Interest:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        color: "#1a83dd",
                        fontWeight: 600,
                      }}
                    >
                      {fmt(result.interesBrutoCetes)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Bonddia Interest:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        color: "#1a83dd",
                        fontWeight: 600,
                      }}
                    >
                      {fmt(result.interesBonddia)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Remainder:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", fontWeight: 600 }}
                    >
                      {fmt(result.remanente)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      ISR:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        color: "error.main",
                        fontWeight: 600,
                      }}
                    >
                      {fmt(result.isr)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "#003366" }}
                    >
                      Total at Maturity:
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 800,
                        color: "#1a83dd",
                        fontFamily: "monospace",
                      }}
                    >
                      {fmt(result.totalFinal)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

            {/* ESTADO INICIAL (Mismo ancho máximo del ticket para simetría) */}
            {!result && !loading && !error && (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: "#f8fafc", // Blanco "fuerte" para resaltar
                  width: "100%",
                  margin: "0 auto",
                  boxShadow: 2,
                  transition: "0.2s ease",

                  //border: "2px solid #10b981", // 🟢 VERDE: Card del estado inicial informativo
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 5,
                  },
                }}
              >
                <Alert severity="info" sx={{ borderRadius: 3 }}>
                  Enter an investment amount and select a term to simulate your
                  CETES investment performance.
                </Alert>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%", borderRadius: 3 }}>
          Purchase successful! Redirecting to your portfolio...
        </Alert>
      </Snackbar>
    </Box>
  );
}
