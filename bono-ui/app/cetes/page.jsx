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
  Stack,
  Snackbar,
  Chip,
  Divider,
} from "@mui/material";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import SavingsIcon from "@mui/icons-material/Savings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaidIcon from "@mui/icons-material/Paid";

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

    setTimeout(() => {
      const montoInvertido = Number(formData.monto);

      const dias = Number(formData.plazo);

      const tCetes = backendRates ? backendRates[dias] / 100 : 0.0645;

      const tBonddia = 0.0598;

      const precioCetes = 10 / (1 + (tCetes * dias) / 360);

      const titulosCetes = Math.floor(montoInvertido / precioCetes);

      const inversionCetes = titulosCetes * precioCetes;

      const sobranteParaBonddia = montoInvertido - inversionCetes;

      const precioBonddia = 2.325028;

      const titulosBonddia = Math.floor(sobranteParaBonddia / precioBonddia);

      const inversionBonddia = titulosBonddia * precioBonddia;

      const remanente = sobranteParaBonddia - inversionBonddia;

      const interesBrutoCetes = titulosCetes * (10 - precioCetes);

      const interesBonddia = inversionBonddia * tBonddia * (dias / 360);

      const isr = (inversionCetes + inversionBonddia) * 0.009 * (dias / 366);

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

      setTimeout(() => {
        router.push("/portafolio");
      }, 2000);
    } catch (err) {
      setError("Error processing purchase. Please check your balance.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const fmt = (val) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(val || 0);

  const returnPercentage = result
    ? (
        ((result.totalFinal - result.montoInvertido) / result.montoInvertido) *
        100
      ).toFixed(2)
    : 0;

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
      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 4,
            md: 6,
          },
        }}
      >
        {/* HEADER */}

        <Paper
          sx={{
            mb: 5,

            p: {
              xs: 4,
              md: 5,
            },

            background: (theme) => `
              linear-gradient(
                135deg,
                ${theme.palette.primary.main} 0%,
                ${theme.palette.background.dark} 100%
              )
            `,

            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              flexWrap: "wrap",

              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 3,
              }}
            >
              <Box
                sx={{
                  width: 72,

                  height: 72,

                  borderRadius: 3,

                  bgcolor: "rgba(255,255,255,0.08)",

                  border: "1px solid rgba(255,255,255,0.12)",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",
                }}
              >
                <SavingsIcon
                  sx={{
                    fontSize: 38,
                  }}
                />
              </Box>

              <Box>
                <Typography variant="h3">CETES Valuation</Typography>

                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.8,

                    mt: 1,
                  }}
                >
                  Calculate your government bond investment returns
                </Typography>
              </Box>
            </Box>

            {result && (
              <Chip
                icon={<TrendingUpIcon />}
                label={`+${returnPercentage}% Return`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.08)",

                  color: "white",
                }}
              />
            )}
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {/* LEFT PANEL */}

          <Grid item xs={12} md={4} lg={3}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Investment Parameters
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Configure your CETES investment simulation.
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <StyledTextField
                  fullWidth
                  label="Investment Amount"
                  name="monto"
                  type="number"
                  value={formData.monto}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />

                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel>Investment Term</InputLabel>

                  <Select
                    name="plazo"
                    value={formData.plazo}
                    label="Investment Term"
                    onChange={handleChange}
                  >
                    <MenuItem value={28}>1 Month (28 days)</MenuItem>

                    <MenuItem value={91}>3 Months (91 days)</MenuItem>

                    <MenuItem value={182}>6 Months (182 days)</MenuItem>

                    <MenuItem value={364}>1 Year (364 days)</MenuItem>
                  </Select>
                </FormControl>

                <PrimaryButton type="submit" disabled={loading} fullWidth>
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

                    bgcolor: "secondary.main",

                    "&:hover": {
                      bgcolor: "secondary.main",
                    },
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

          {/* RIGHT PANEL */}
          <Grid item xs={12} md={8} lg={9}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {result ? (
              <Stack spacing={2.5}>
                {/* KPI CARDS */}

                <Grid container spacing={2}>
                  {[
                    {
                      title: "Expected Return",
                      value: `${returnPercentage}%`,
                      icon: <TrendingUpIcon />,
                    },

                    {
                      title: "Invested Capital",
                      value: fmt(result.montoInvertido),
                      icon: <AccountBalanceWalletIcon />,
                    },

                    {
                      title: "Estimated ISR",
                      value: fmt(result.isr),
                      icon: <PaidIcon />,
                    },
                  ].map((item) => (
                    <Grid item xs={12} md={4} key={item.title}>
                      <Paper
                        sx={{
                          p: 2.5,

                          height: "100%",

                          transition: "0.2s ease",

                          "&:hover": {
                            transform: "translateY(-2px)",

                            boxShadow: 3,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",

                            justifyContent: "space-between",

                            alignItems: "center",

                            mb: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 42,

                              height: 42,

                              borderRadius: 2,

                              bgcolor: "background.subtle",

                              color: "primary.main",

                              display: "flex",

                              alignItems: "center",

                              justifyContent: "center",
                            }}
                          >
                            {item.icon}
                          </Box>

                          <Chip
                            size="small"
                            label="LIVE"
                            sx={{
                              bgcolor: "background.subtle",

                              color: "primary.main",

                              fontWeight: 700,
                            }}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 0.5,
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* MAIN RESULT */}

                <Paper
                  sx={{
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",

                      justifyContent: "space-between",

                      alignItems: "center",

                      flexWrap: "wrap",

                      gap: 2,

                      mb: 2.5,
                    }}
                  >
                    <Typography variant="h5">Investment Breakdown</Typography>

                    <Chip
                      label={`CETES ${result.plazo}`}
                      color="primary"
                      sx={{
                        fontWeight: 700,
                      }}
                    />
                  </Box>

                  <Stack spacing={0}>
                    {[
                      ["CETES Investment", result.inversionCetes],

                      ["BONDDIA Investment", result.inversionBonddia],

                      ["Gross Interest", result.interesBrutoCetes],

                      ["BONDDIA Interest", result.interesBonddia],

                      ["Remainder", result.remanente],

                      ["ISR", result.isr],
                    ].map(([label, value]) => (
                      <Box key={label}>
                        <Box
                          sx={{
                            display: "flex",

                            justifyContent: "space-between",

                            alignItems: "center",

                            py: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {label}
                          </Typography>

                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 700,

                              fontFamily: "monospace",

                              color:
                                label === "ISR"
                                  ? "error.main"
                                  : label.includes("Interest")
                                    ? "primary.main"
                                    : "text.primary",
                            }}
                          >
                            {fmt(value)}
                          </Typography>
                        </Box>

                        <Divider />
                      </Box>
                    ))}
                  </Stack>

                  {/* TOTAL */}

                  <Box
                    sx={{
                      mt: 3,

                      p: 3,

                      borderRadius: 3,

                      background: (theme) => `
              linear-gradient(
                135deg,
                ${theme.palette.primary.main} 0%,
                ${theme.palette.background.dark} 100%
              )
            `,

                      color: "white",

                      position: "relative",

                      overflow: "hidden",
                    }}
                  >
                    {/* Decorative Glow */}

                    <Box
                      sx={{
                        position: "absolute",

                        top: -40,

                        right: -40,

                        width: 140,

                        height: 140,

                        borderRadius: "50%",

                        bgcolor: "rgba(255,255,255,0.06)",
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.7)",

                        mb: 0.5,

                        position: "relative",
                      }}
                    >
                      Total at Maturity
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: {
                          xs: "2rem",
                          md: "2.6rem",
                        },

                        fontWeight: 800,

                        letterSpacing: "-0.05em",

                        fontFamily: "monospace",

                        lineHeight: 1,

                        color: "#fff",

                        position: "relative",
                      }}
                    >
                      {fmt(result.totalFinal)}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,

                        color: "rgba(255,255,255,0.72)",

                        maxWidth: 420,

                        position: "relative",
                      }}
                    >
                      Estimated total value at the end of the investment term.
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            ) : (
              <Paper
                sx={{
                  p: 5,

                  textAlign: "center",
                }}
              >
                <Typography variant="h5" sx={{ mb: 1.5 }}>
                  Start Your Simulation
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: 520,

                    mx: "auto",
                  }}
                >
                  Enter an investment amount and select a term to simulate your
                  CETES investment performance.
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert severity="success">
          Purchase successful! Redirecting to your portfolio...
        </Alert>
      </Snackbar>
    </Box>
  );
}
